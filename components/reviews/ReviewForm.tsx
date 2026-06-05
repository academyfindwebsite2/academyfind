"use client";

import { useState } from "react";

interface Props {
  instituteId: string;
}

export default function ReviewForm({
  instituteId,
}: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        "/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            instituteId,
            rating,
            comment,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ??
            "Failed to submit review"
        );
        return;
      }

      alert(
        "Review submitted successfully!"
      );

      setComment("");
      setRating(5);

      window.location.reload();
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold">
        Write a Review
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-3xl border bg-white p-8"
      >
        <div>
          <label className="mb-2 block font-medium">
            Rating
          </label>

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                Number(e.target.value)
              )
            }
            className="w-full rounded-xl border p-3"
          >
            <option value={5}>
              ⭐⭐⭐⭐⭐ (5)
            </option>

            <option value={4}>
              ⭐⭐⭐⭐ (4)
            </option>

            <option value={3}>
              ⭐⭐⭐ (3)
            </option>

            <option value={2}>
              ⭐⭐ (2)
            </option>

            <option value={1}>
              ⭐ (1)
            </option>
          </select>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-medium">
            Comment
          </label>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            className="w-full rounded-xl border p-3"
            placeholder="Share your experience..."
          />
        </div>

        <button
          disabled={loading}
          className="mt-6 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-500"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>
      </form>
    </section>
  );
}