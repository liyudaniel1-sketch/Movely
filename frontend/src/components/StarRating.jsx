function StarRating({ rating }) {
  const fullStars = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= fullStars ? "text-yellow-400" : "text-gray-600"}
        >
          ★
        </span>
      ))}
      <span className="text-gray-300 text-sm ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default StarRating;