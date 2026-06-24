import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

initializeApp();

const auth = getAuth();
const db = getFirestore();

// Only this address can claim the bootstrap admin slot (the very first grant,
// before any admin exists). Update and redeploy if the designated owner changes.
const BOOTSTRAP_ADMIN_EMAIL = "chizobaezeh24@gmail.com";

/**
 * Grants the "admin" custom claim to a user by email.
 * Bootstraps the very first admin (no admins exist yet, target must be
 * BOOTSTRAP_ADMIN_EMAIL and must be granting themselves), otherwise only
 * an existing admin can grant the role to someone else.
 */
export const grantAdmin = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Sign in first.");
  }

  const targetEmail = request.data?.email as string | undefined;
  if (!targetEmail) {
    throw new HttpsError("invalid-argument", "email is required.");
  }

  const adminsSnapshot = await db.collection("users").where("role", "==", "admin").limit(1).get();
  const isBootstrap = adminsSnapshot.empty;
  const callerIsAdmin = request.auth.token.role === "admin";

  if (isBootstrap) {
    const callerEmail = request.auth.token.email;
    if (targetEmail !== BOOTSTRAP_ADMIN_EMAIL || callerEmail !== BOOTSTRAP_ADMIN_EMAIL) {
      throw new HttpsError("permission-denied", "Bootstrap admin slot is reserved for a specific account.");
    }
  } else if (!callerIsAdmin) {
    throw new HttpsError("permission-denied", "Only an existing admin can grant admin access.");
  }

  const targetUser = await auth.getUserByEmail(targetEmail);
  await auth.setCustomUserClaims(targetUser.uid, { role: "admin" });

  await db.collection("users").doc(targetUser.uid).set(
    {
      uid: targetUser.uid,
      email: targetUser.email ?? null,
      displayName: targetUser.displayName ?? null,
      photoURL: targetUser.photoURL ?? null,
      role: "admin",
      createdAt: new Date(),
    },
    { merge: true }
  );

  return { uid: targetUser.uid, email: targetUser.email };
});

/**
 * Keeps recipes/{recipeId}.rating and ratingCount in sync with the
 * ratings collection whenever a rating is created, changed, or deleted.
 */
export const onRatingWrite = onDocumentWritten("ratings/{ratingId}", async (event) => {
  const recipeId = (event.data?.after.data() ?? event.data?.before.data())?.recipeId as string | undefined;
  if (!recipeId) return;

  const snapshot = await db.collection("ratings").where("recipeId", "==", recipeId).get();
  const count = snapshot.size;
  const average = count === 0
    ? 0
    : Math.round((snapshot.docs.reduce((sum, doc) => sum + (doc.data().value as number), 0) / count) * 10) / 10;

  await db.collection("recipes").doc(recipeId).update({ rating: average, ratingCount: count });
});

/**
 * Maintains a public, anonymous subscriber count on siteConfig/main so the
 * homepage can show a real number without exposing the newsletter_subscribers
 * collection (which is admin-read-only) to public reads.
 */
export const onNewsletterSubscriberWrite = onDocumentWritten("newsletter_subscribers/{subscriberId}", async (event) => {
  const existedBefore = event.data?.before.exists;
  const existsAfter = event.data?.after.exists;
  if (existedBefore === existsAfter) return;

  await db.collection("siteConfig").doc("main").set(
    { subscriberCount: FieldValue.increment(existsAfter ? 1 : -1) },
    { merge: true }
  );
});
