require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function tmdbFetch(path) {
  const res = await fetch(`https://api.themoviedb.org/3${path}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: "application/json",
    },
  });
  return res.json();
}

async function main() {
  const genreData = await tmdbFetch("/genre/movie/list");
  const genreIdToCategoryId = {};

  for (const genre of genreData.genres) {
    const category = await prisma.category.upsert({
      where: { name: genre.name },
      update: {},
      create: { name: genre.name },
    });
    genreIdToCategoryId[genre.id] = category.id;
  }

  console.log("Categories synced with TMDB genres");

  const sources = [
    "/movie/popular?page=1",
    "/movie/popular?page=2",
    "/movie/top_rated?page=1",
  ];

  let insertedCount = 0;

  for (const source of sources) {
    const movieData = await tmdbFetch(source);

    for (const movie of movieData.results) {
      const alreadyExists = await prisma.movie.findFirst({
        where: { name: movie.title },
      });

      if (alreadyExists) {
        console.log(`Skipped (already exists): ${movie.title}`);
        continue;
      }

      const categoryIds = movie.genre_ids
        .map((tmdbGenreId) => genreIdToCategoryId[tmdbGenreId])
        .filter(Boolean);

      await prisma.movie.create({
        data: {
          name: movie.title,
          description: movie.overview,
          posterUrl: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
          releaseYear: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
          categories: {
            create: categoryIds.map((id) => ({
              category: { connect: { id } },
            })),
          },
        },
      });

      console.log(`Inserted: ${movie.title}`);
      insertedCount++;
    }
  }

  console.log(`Seeding complete! Inserted ${insertedCount} new movies.`);
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());