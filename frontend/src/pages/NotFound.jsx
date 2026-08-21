import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-4">
          Error 404
        </p>
        <h1 className="text-white text-6xl font-bold tracking-tight mb-4">
          Scene not found
        </h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist — maybe it got cut in the final edit.
        </p>
        <Link
          to="/"
          className="inline-block rounded-full bg-violet-600 px-6 py-3 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20"
        >
          Back to Movely
        </Link>
      </div>
    </div>
  );
}

export default NotFound;