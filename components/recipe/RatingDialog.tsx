"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  onSubmit: (rating: number) => void;
}

export function RatingDialog({ open, onOpenChange, recipeTitle, onSubmit }: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating);
    setSubmitted(true);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setRating(0);
      setHovered(0);
      setSubmitted(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent style={{ fontFamily: "'Inter', sans-serif" }}>
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "'Dancing Script', cursive", color: "var(--ce-text)" }}>
            Rate this Recipe
          </DialogTitle>
          <DialogDescription>
            {submitted ? "Thanks for rating!" : `How did "${recipeTitle}" turn out for you?`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex items-center justify-center gap-1 py-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={28} fill={s <= rating ? "#FFC72C" : "none"} style={{ color: "#FFC72C" }} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${s} stars`}
              >
                <Star
                  size={32}
                  fill={s <= (hovered || rating) ? "#FFC72C" : "none"}
                  style={{ color: "#FFC72C" }}
                />
              </button>
            ))}
          </div>
        )}

        {!submitted && (
          <DialogFooter>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full py-2.5 rounded-xl text-sm transition-opacity"
              style={{
                background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
                color: "#5C4033",
                fontWeight: 700,
                opacity: rating === 0 ? 0.5 : 1,
              }}
            >
              Submit Rating
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
