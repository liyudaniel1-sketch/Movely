import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

function ReviewCard({ comment, onUpdated, onDeleted }) {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(comment.rating);
  const [text, setText] = useState(comment.comment);
  const [saving, setSaving] = useState(false);

  const isOwner = user && user.id === comment.userId;
  const isAdmin = user && user.role === "ADMIN";
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`http://localhost:3000/api/comments/${comment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment: text }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      onUpdated(data);
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    const confirmMessage = isOwner
      ? "Delete your review?"
      : "Remove this review as an admin?";
    if (!confirm(confirmMessage)) return;

    await fetch(`http://localhost:3000/api/comments/${comment.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    onDeleted(comment.id);
  }

  if (isEditing) {
    return (
      <div className="bg-white/[0.03] border border-violet-400/30 p-4 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-xl transition-transform hover:scale-110 ${
                star <= rating ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-white text-sm outline-none focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/20"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setIsEditing(false);
              setRating(comment.rating);
              setText(comment.comment);
            }}
            className="text-gray-400 hover:text-white text-sm px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 hover:border-violet-400/30 hover:bg-violet-500/5 transition-all p-4 rounded-xl">
      <div className="flex justify-between items-center mb-1">
        <p className="text-white font-medium">{comment.user.name}</p>
        <StarRating rating={comment.rating} />
      </div>
      <p className="text-gray-300 text-sm mb-2">{comment.comment}</p>

      {(canEdit || canDelete) && (
        <div className="flex gap-3 pt-2 border-t border-white/5">
          {canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
            >
              {isOwner ? "Delete" : "Remove (Admin)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewCard;