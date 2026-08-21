import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={"/movies/" + movie.id}
      className="group relative block overflow-hidden rounded-2xl bg-white/5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
            View Details
          </span>
        </div>

        {movie.releaseYear && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {movie.releaseYear}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-white transition-colors group-hover:text-violet-400">
          {movie.name}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {movie.releaseYear || "Coming soon"}
          </span>

          <span className="flex items-center gap-1 text-sm font-medium text-violet-400">
            ★ <span>Movie</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;