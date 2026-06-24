import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/client";

export async function uploadRecipeImage(file: File, recipeId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `recipes/${recipeId}/hero-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadBlogImage(file: File, postId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `blog/${postId}/cover-${Date.now()}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteRecipeImageByUrl(url: string): Promise<void> {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Best-effort cleanup — ignore if already gone or not a storage URL.
  }
}
