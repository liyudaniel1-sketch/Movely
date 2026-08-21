import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("https://movely.onrender.com/api/movies")
      .then((res) => res.json())
      .then(setCategories);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("https://movely.onrender.com/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to add category");
      return;
    }

    setNewName("");
    fetchCategories();
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="mb-6">
          <p className="text-sm font-medium text-violet-400">
            Movie Organization
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            Add a New Category
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create categories to organize your movie collection.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Enter category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-all placeholder:text-gray-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
            required
          />

          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
          >
            Add Category
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Existing Categories
            </p>

            <h3 className="mt-1 text-xl font-bold text-white">
              Your Categories
            </h3>
          </div>

          <span className="text-sm text-gray-500">
            {categories.length} Categories
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-medium text-gray-300 transition-all hover:border-violet-400/30 hover:bg-violet-500/5 hover:text-white"
              >
                {cat.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              No categories have been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;