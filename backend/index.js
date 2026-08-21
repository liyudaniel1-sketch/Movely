require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const { requireAuth, requireAdmin } = require("./middleware/auth");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const cors = require("cors");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from the movie review API!");
});

app.get("/api/categories", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

app.post("/api/categories", requireAuth, requireAdmin, async (req, res) => {
    const{name} = req.body;
    const category = await prisma.category.create({data:{name},});
    res.status(201).json(category);
});

app.get("/api/movies", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        comments: {
          select: {
            rating: true,
          },
        },
      },
    });

    const moviesWithRatings = movies.map((movie) => {
      const reviewCount = movie.comments.length;

      const averageRating =
        reviewCount > 0
          ? movie.comments.reduce(
              (sum, comment) => sum + comment.rating,
              0
            ) / reviewCount
          : null;

      return {
        ...movie,
        reviewCount,
        averageRating:
          averageRating !== null
            ? Number(averageRating.toFixed(1))
            : null,
      };
    });

    res.json(moviesWithRatings);
  } catch (error) {
    console.error("Error fetching movies:", error);

    res.status(500).json({
      error: "Failed to fetch movies",
    });
  }
});

app.post("/api/movies", requireAuth, requireAdmin, async (req, res) => {
  const { name, description, posterUrl, releaseYear, categoryIds } = req.body;

  const movie = await prisma.movie.create({
    data: {
      name,
      description,
      posterUrl,
      releaseYear,
      categories: {
        create: categoryIds.map((id) => ({
          category: { connect: { id } },
        })),
      },
    },
    include: {
      categories: { include: { category: true } },
    },
  });

  res.status(201).json(movie);
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.post("/api/comments", requireAuth, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const userId = req.user.userId;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: { movieId, userId, rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });
    res.status(201).json(newComment);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "You already reviewed this movie" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/movies/:id/comments", async (req, res) => {
  const movieId = parseInt(req.params.id);

  const comments = await prisma.comment.findMany({
    where: { movieId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(comments);
});

app.put("/api/comments/:id", requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  const existing = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!existing) {
    return res.status(404).json({ error: "Comment not found" });
  }

  if (existing.userId !== req.user.userId) {
    return res.status(403).json({ error: "You can only edit your own review" });
  }

  const updated = await prisma.comment.update({
    where: { id: commentId },
    data: { rating, comment },
  });

  res.json(updated);
});

app.delete("/api/comments/:id", requireAuth, async (req, res) => {
  const commentId = parseInt(req.params.id);

  const existing = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!existing) {
    return res.status(404).json({ error: "Comment not found" });
  }

  const isOwner = existing.userId === req.user.userId;
  const isAdmin = req.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "Not authorized to delete this comment" });
  }

  await prisma.comment.delete({ where: { id: commentId } });
  res.status(204).send();
});

app.get("/api/movies/:id", async (req, res) => {
  const movieId = parseInt(req.params.id);

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      categories: { include: { category: true } },
      comments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  res.json(movie);
});

app.put("/api/movies/:id", requireAuth, requireAdmin, async (req, res) => {
  const movieId = parseInt(req.params.id);
  const { name, description, posterUrl, releaseYear, categoryIds } = req.body;

  const existing = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!existing) {
    return res.status(404).json({ error: "Movie not found" });
  }

  if (categoryIds) {
    await prisma.movieCategory.deleteMany({ where: { movieId } });
  }

  const updated = await prisma.movie.update({
    where: { id: movieId },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(posterUrl !== undefined && { posterUrl }),
      ...(releaseYear !== undefined && { releaseYear }),
      ...(categoryIds && {
        categories: {
          create: categoryIds.map((id) => ({ category: { connect: { id } } })),
        },
      }),
    },
    include: { categories: { include: { category: true } } },
  });

  res.json(updated);
});

app.delete("/api/movies/:id", requireAuth, requireAdmin, async (req, res) => {
  const movieId = parseInt(req.params.id);

  const existing = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!existing) {
    return res.status(404).json({ error: "Movie not found" });
  }

  await prisma.movieCategory.deleteMany({ where: { movieId } });
  await prisma.comment.deleteMany({ where: { movieId } });
  await prisma.movie.delete({ where: { id: movieId } });

  res.status(204).send();
});

app.get("/api/categories/:id/movies", async (req, res) => {
  const categoryId = parseInt(req.params.id);

  const movies = await prisma.movie.findMany({
    where: {
      categories: {
        some: { categoryId },
      },
    },
    include: { categories: { include: { category: true } } },
  });

  res.json(movies);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});