// One-time migration script: copies lib/mock-recipes.ts SAMPLE_RECIPES into the
// live Firestore "recipes" collection. Run manually via:
//   node scripts/seed-recipes.mjs
// Uses the gcloud CLI's already-authenticated user token (must have Firestore
// write access, e.g. project owner/editor) rather than a service account key.

import { execSync } from "node:child_process";

const PROJECT_ID = "chizzyeats";

// Maps the free-text `category` label used in mock data to the slug used by
// /category/[slug] routes and lib/category-data.ts's CATEGORY_META keys.
const CATEGORY_SLUGS = {
  Nigerian: "nigerian",
  African: "african",
  Asian: "asian",
  European: "european",
  American: "american",
  Desserts: "desserts",
  Drinks: "drinks",
  "Budget Meals": "budget",
};

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }
  throw new Error(`Unsupported value type: ${typeof value}`);
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    fields[key] = toFirestoreValue(value);
  }
  return fields;
}

async function loadSampleRecipes() {
  // lib/mock-recipes.ts is plain TS with a type-only import and one type
  // annotation — strip both so plain Node ESM (no TS loader) can run it.
  const fs = await import("node:fs");
  const src = fs.readFileSync(new URL("../lib/mock-recipes.ts", import.meta.url), "utf8");
  const stripped = src
    .replace(/^import type.*$/m, "")
    .replace(/: Recipe\[\]/, "");
  const tmpPath = "/tmp/mock-recipes-stripped.mjs";
  fs.writeFileSync(tmpPath, stripped);
  const { SAMPLE_RECIPES } = await import(tmpPath);
  return SAMPLE_RECIPES;
}

async function main() {
  const SAMPLE_RECIPES = await loadSampleRecipes();
  console.log(`Loaded ${SAMPLE_RECIPES.length} mock recipes.`);

  const token = execSync("gcloud auth print-access-token").toString().trim();
  const now = new Date();

  for (const recipe of SAMPLE_RECIPES) {
    const categorySlug = CATEGORY_SLUGS[recipe.category];
    if (!categorySlug) {
      console.warn(`No category slug mapping for "${recipe.category}" (recipe ${recipe.id}) — skipping categorySlug field.`);
    }

    const docData = {
      ...recipe,
      categorySlug: categorySlug ?? null,
      status: "published",
      ratingCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    };

    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/recipes/${recipe.id}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: toFirestoreFields(docData) }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to write recipe ${recipe.id}: ${res.status} ${body}`);
    }
    console.log(`Seeded: ${recipe.id}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
