import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function ReviewForm({ movieId, onReviewSubmitted }) {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        movieId: Number(movieId),
        rating,
        comment,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setComment("");
    setRating(5);
    onReviewSubmitted(data);
  }

  if (!user) {
    return (
      <p className="text-sm text-gray-400">
        Log in to write a review.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-purple-900/10 p-5 shadow-lg shadow-violet-950/20"
    >
      <div>
        <p className="mb-3 text-sm font-medium text-white">
          Your rating
        </p>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={
                "text-2xl transition-transform hover:scale-110 " +
                (star <= rating
                  ? "text-violet-400"
                  : "text-gray-600")
              }
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Share your thoughts about this movie..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none transition-all placeholder:text-gray-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
        rows={4}
        required
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-violet-600 py-3 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}

export default ReviewForm;