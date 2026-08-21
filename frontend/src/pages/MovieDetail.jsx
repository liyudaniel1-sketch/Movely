import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import CategoryPill from "../components/CategoryPill";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  function fetchMovie() {
    fetch(`https://movely.onrender.com/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setLoading(false);
      });
  }

  function handleReviewSubmitted(newComment) {
    setMovie((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
    }));
  }

  function handleReviewUpdated(updatedComment) {
    setMovie((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === updatedComment.id ? { ...c, ...updatedComment } : c
      ),
    }));
  }

  function handleReviewDeleted(commentId) {
    setMovie((prev) => ({
      ...prev,
      comments: prev.comments.filter((c) => c.id !== commentId),
    }));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0b0b0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0b0b0f]">
        <p className="text-gray-400">Movie not found.</p>
      </div>
    );
  }

  const averageRating =
    movie.comments.length > 0
      ? movie.comments.reduce((sum, c) => sum + c.rating, 0) / movie.comments.length
      : 0;

  return (
    <div className="bg-[#0b0b0f] min-h-screen">
      <div className="relative h-[380px] overflow-hidden">
        <img
          src={movie.posterUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/70 to-[#0b0b0f]/30" />
      </div>

      <div className="px-6 md:px-10 -mt-56 relative">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <img
            src={movie.posterUrl}
            alt={movie.name}
            className="w-72 md:w-96 rounded-2xl shadow-2xl shrink-0 ring-1 ring-white/10 mx-auto md:mx-0"
          />

          <div className="flex-1 pb-4">
            <span className="inline-block rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300 mb-4">
              {movie.releaseYear || "Movely"}
            </span>

            <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {movie.name}
            </h1>

            <div className="flex gap-2 mb-4 flex-wrap">
              {movie.categories.map((c) => (
                <CategoryPill key={c.category.id} name={c.category.name} />
              ))}
            </div>

            {movie.comments.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <StarRating rating={averageRating} />
                <span className="text-gray-500 text-sm">
                  · {movie.comments.length}{" "}
                  {movie.comments.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            )}

            <p className="text-gray-300 leading-relaxed max-w-2xl">
              {movie.description}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-[1fr_1.3fr] gap-10 pb-16">
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">
              Write a review
            </h2>
            <ReviewForm movieId={id} onReviewSubmitted={handleReviewSubmitted} />
          </div>

          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Reviews</h2>
            {movie.comments.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {movie.comments.map((comment) => (
                  <ReviewCard
                    key={comment.id}
                    comment={comment}
                    onUpdated={handleReviewUpdated}
                    onDeleted={handleReviewDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;