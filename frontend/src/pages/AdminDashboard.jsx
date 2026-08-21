import { useState } from "react";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import AdminMovies from "../components/AdminMovies";
import AdminCategories from "../components/AdminCategories";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-[#0b0b0f] text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#101014] p-6 md:flex">
            <div className="mb-12">
              <h1 className="text-2xl font-bold tracking-tight">
                MOVE<span className="text-violet-400">LY</span>
                <span className="text-gray-500"> ADMIN</span>
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your movie platform
              </p>
            </div>

            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("movies")}
                className={
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all " +
                  (activeTab === "movies"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white")
                }
              >
                <span className="text-lg">🎬</span>
                Movies
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-all " +
                  (activeTab === "categories"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white")
                }
              >
                <span className="text-lg">📁</span>
                Categories
              </button>
            </nav>

            <div className="mt-auto border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-widest text-gray-600">
                Movely Management
              </p>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0b0f]/80 px-6 py-5 backdrop-blur-md md:px-10">
              <div>
                <p className="text-sm font-medium text-violet-400">
                  Administration
                </p>

                <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                  {activeTab === "movies"
                    ? "Movie Management"
                    : "Category Management"}
                </h2>
              </div>

              <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-300">
                Admin Panel
              </div>
            </header>

            <div className="border-b border-white/10 bg-[#101014] px-6 py-3 md:hidden">
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTab("movies")}
                  className={
                    "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all " +
                    (activeTab === "movies"
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-gray-400")
                  }
                >
                  Movies
                </button>

                <button
                  onClick={() => setActiveTab("categories")}
                  className={
                    "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all " +
                    (activeTab === "categories"
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-gray-400")
                  }
                >
                  Categories
                </button>
              </div>
            </div>

            <section className="p-6 md:p-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 md:p-8">
                {activeTab === "movies" ? (
                  <AdminMovies />
                ) : (
                  <AdminCategories />
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}

export default AdminDashboard;