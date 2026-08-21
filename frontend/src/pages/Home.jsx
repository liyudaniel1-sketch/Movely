import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading movies:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    );
  }

  const featured = movies[heroIndex];

  const topRatedMovies = [...movies]
    .filter((movie) => movie.averageRating !== null)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 6);

  const filteredMovies = movies.filter((movie) => {
    if (!isSearching) return true;

    const query = searchQuery.toLowerCase();
    const movieName = movie.name?.toLowerCase() || "";
    const movieDescription = movie.description?.toLowerCase() || "";

    const movieCategories =
      movie.categories
        ?.map((item) => item.category?.name?.toLowerCase() || "")
        .join(" ") || "";

    return (
      movieName.includes(query) ||
      movieDescription.includes(query) ||
      movieCategories.includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#0b0b0f]">
      {!isSearching && featured && (
        <section className="relative flex h-[620px] items-end overflow-hidden">
          <img
            src={featured.posterUrl}
            alt={featured.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-[#0b0b0f]/30" />

          <div className="relative z-10 max-w-2xl px-8 pb-24 md:px-16">
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
                Featured
              </span>

              {featured.releaseYear && (
                <span className="text-sm text-gray-400">
                  {featured.releaseYear}
                </span>
              )}

              {featured.averageRating !== null && (
                <span className="text-sm font-medium text-violet-400">
                  ★ {featured.averageRating}/5
                </span>
              )}
            </div>

            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
              {featured.name}
            </h1>

            <p className="mb-6 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg">
              {featured.description || "Discover this movie on Movely."}
            </p>

            {featured.categories?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {featured.categories.map((item) => (
                  <span
                    key={item.category?.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300 backdrop-blur-sm"
                  >
                    {item.category?.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                to={"/movies/" + featured.id}
                className="rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
              >
                View Details
              </Link>

              <a
                href="#browse"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
              >
                Browse Movies
              </a>
            </div>
          </div>

          <div className="absolute right-8 top-8 z-10 text-sm text-gray-400 md:right-16">
            <span className="text-white">
              {String(heroIndex + 1).padStart(2, "0")}
            </span>
            <span className="mx-2 text-gray-600">/</span>
            <span>{String(movies.length).padStart(2, "0")}</span>
          </div>

          <div className="absolute bottom-10 right-8 z-10 flex gap-2 md:right-16">
            {movies.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                aria-label={"Show movie " + (i + 1)}
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (i === heroIndex
                    ? "w-8 bg-violet-400"
                    : "w-2 bg-white/30 hover:bg-white/60")
                }
              />
            ))}
          </div>
        </section>
      )}

      {!isSearching && (
        <section id="top-rated" className="px-8 py-16 md:px-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-400">
                Community Favorites
              </p>

              <h2 className="text-3xl font-bold text-white">
                Top Rated
              </h2>
            </div>

            <span className="hidden text-sm text-gray-500 sm:block">
              Based on community reviews
            </span>
          </div>

          {topRatedMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {topRatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
              <p className="text-gray-400">
                No rated movies yet. Be the first to leave a review!
              </p>
            </div>
          )}
        </section>
      )}

      <section
        id="browse"
        className={
          "px-8 py-16 md:px-16 " + (isSearching ? "pt-12" : "")
        }
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-400">
              {isSearching ? "Search Results" : "Explore"}
            </p>

            <h2 className="text-3xl font-bold text-white">
              {isSearching
                ? 'Results for "' + searchQuery + '"'
                : "Browse Movies"}
            </h2>
          </div>

          <span className="hidden text-sm text-gray-500 sm:block">
            {isSearching
              ? filteredMovies.length +
                " " +
                (filteredMovies.length === 1 ? "movie" : "movies") +
                " found"
              : movies.length + " movies available"}
          </span>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="mb-2 text-xl font-semibold text-white">
              No movies found
            </p>

            <p className="text-gray-400">
              We couldn't find any movies matching "{searchQuery}".
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition-all hover:bg-violet-500"
            >
              Browse All Movies
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;