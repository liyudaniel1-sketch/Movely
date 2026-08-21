import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      navigate("/?search=" + encodeURIComponent(trimmedSearch) + "#browse");
    } else {
      navigate("/#browse");
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/95 px-8 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          MOVE<span className="text-violet-400">LY</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-medium text-gray-400 md:flex">
          <Link
            to="/"
            className="transition-colors hover:text-white"
          >
            Home
          </Link>

          <a
            href="/#browse"
            className="transition-colors hover:text-white"
          >
            Discover
          </a>

          <a
            href="/#top-rated"
            className="transition-colors hover:text-white"
          >
            Top Rated
          </a>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 justify-center lg:flex"
        >
          <div className="flex w-full max-w-sm items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-gray-400 transition-all focus-within:border-violet-400/50 focus-within:bg-white/10">
            <span>⌕</span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden font-medium text-gray-300 sm:block">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-4 py-2 text-gray-300 transition-all hover:border-red-400/50 hover:bg-red-400/10 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-400 transition-colors hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-violet-600 px-5 py-2 font-medium text-white transition-all hover:scale-105 hover:bg-violet-500"
              >
                Join Movely
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;