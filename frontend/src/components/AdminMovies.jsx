import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function AdminMovies() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    posterUrl: "",
    releaseYear: "",
    categoryIds: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMovies();

    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  function fetchMovies() {
    fetch("http://localhost:3000/api/movies")
      .then((res) => res.json())
      .then(setMovies);
  }

  function toggleCategory(id) {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((categoryId) => categoryId !== id)
        : [...prev.categoryIds, id],
    }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...form,
        releaseYear: Number(form.releaseYear),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to add movie");
      return;
    }

    setForm({
      name: "",
      description: "",
      posterUrl: "",
      releaseYear: "",
      categoryIds: [],
    });

    fetchMovies();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this movie?")) return;

    await fetch("http://localhost:3000/api/movies/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    fetchMovies();
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-6">
          <p className="text-sm font-medium text-violet-400">
            Movie Library
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            Add a New Movie
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add a movie to your Movely collection.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="grid gap-5 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Movie Title
            </label>

            <input
              type="text"
              placeholder="Enter movie title"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Release Year
            </label>

            <input
              type="number"
              placeholder="e.g. 2024"
              value={form.releaseYear}
              onChange={(e) =>
                setForm({
                  ...form,
                  releaseYear: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Poster URL
            </label>

            <input
              type="text"
              placeholder="https://..."
              value={form.posterUrl}
              onChange={(e) =>
                setForm({
                  ...form,
                  posterUrl: e.target.value,
                })
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>

            <textarea
              placeholder="Write a short description about the movie..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Categories
            </label>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={
                    "rounded-full border px-4 py-2 text-sm font-medium transition-all " +
                    (form.categoryIds.includes(cat.id)
                      ? "border-violet-400 bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                      : "border-white/10 bg-white/5 text-gray-400 hover:border-violet-400/40 hover:text-white")
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="md:col-span-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
            >
              Add Movie
            </button>
          </div>
        </form>
      </div>

      <div className="border-t border-white/10 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Existing Movies
            </p>

            <h3 className="mt-1 text-xl font-bold text-white">
              Your Movie Collection
            </h3>
          </div>

          <span className="text-sm text-gray-500">
            {movies.length} Movies
          </span>
        </div>

        <div className="space-y-3">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-all hover:border-violet-400/30 hover:bg-violet-500/5"
            >
              <div className="flex min-w-0 items-center gap-3">
                {movie.posterUrl && (
                  <img
                    src={movie.posterUrl}
                    alt={movie.name}
                    className="h-14 w-10 rounded-lg object-cover"
                  />
                )}

                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {movie.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {movie.releaseYear || "Release year unavailable"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(movie.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-400/10 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          ))}

          {movies.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                No movies have been added yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMovies;