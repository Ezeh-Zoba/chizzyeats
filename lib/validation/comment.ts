import { z } from "zod";

export const commentSchema = z.object({
  text: z.string().trim().min(1, "Comment can't be empty.").max(1000, "Comment is too long (max 1000 characters)."),
  recipeId: z.string().min(1),
});

export type CommentInput = z.infer<typeof commentSchema>;
