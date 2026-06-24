// One-time script: seeds the "Milk: The Universal Ingredient" blog post into
// the live Firestore "blogPosts" collection.
// Run with:  node scripts/seed-milk-blog.mjs
// Requires an active gcloud auth session with Firestore write access.

import { execSync } from "node:child_process";

const PROJECT_ID = "chizzyeats";
const SLUG = "milk-the-universal-ingredient";

// ── Firestore REST helpers ────────────────────────────────────────────────────

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

// ── Blog post content ─────────────────────────────────────────────────────────

const content = [
  {
    type: "paragraph",
    text: "Milk is one of those ingredients that quietly shows up everywhere. From the splash in your morning tea to the béchamel coating your pasta at dinner, it is the backbone of so many dishes — and most of the time, we barely notice it is there. But take it away, and you will feel the absence immediately.",
  },
  {
    type: "heading",
    level: 2,
    text: "Liquid or Powder, Skim or Full Cream — It's All Milk",
  },
  {
    type: "paragraph",
    text: "Not all milk is the same, and yet they all bring something to the table. Full-cream milk for richness and body. Skim milk when you want the flavour without the heaviness. Evaporated milk for that deep, concentrated creaminess that comes in a can and lasts forever on the shelf. And powdered milk — the true pantry underdog — sitting quietly in the back of the cupboard until the day it saves everything. Each form has its moment, and knowing when to reach for which one is a quiet kind of kitchen wisdom.",
  },
  {
    type: "heading",
    level: 2,
    text: "Sweet, Savoury, and Everything In Between",
  },
  {
    type: "paragraph",
    text: "The range of dishes milk touches is genuinely staggering. On the sweet side: custards, rice pudding, creamy hot chocolate, ice cream bases, pancake batter, bread dough that stays soft for days. On the savoury side: white sauces, soups, mashed potatoes with that extra silkiness, chai that wraps you up like a blanket, scrambled eggs that are just a little more luxurious. It softens, it enriches, it carries flavour without shouting over everything else. That balance is rare in an ingredient.",
  },
  {
    type: "insight",
    icon: "nutrition",
    text: "Milk's fat and protein content is the reason it behaves so differently from water in cooking. The fat carries fat-soluble flavours and creates richness, while the proteins interact with heat and acid — which is exactly what makes cheese and yoghurt possible. Water cannot do any of that.",
    source: "Food Science Basics",
    sourceUrl: "",
  },
  {
    type: "heading",
    level: 2,
    text: "What You Can Make From Milk",
  },
  {
    type: "paragraph",
    text: "And then there is what happens when you push milk further. Butter — at its most basic, just cream and time (or a food processor if you are in a hurry). Cheese — with heat, acid, or cultures, depending on the style. Yoghurt — warmth, a starter, and patience. These three things alone represent centuries of human ingenuity. Three of the most ancient, most universally loved foods in the world, all tracing their roots back to the same humble liquid. That is not a small thing.",
  },
  {
    type: "quote",
    text: "Give me milk and I'll give you a whole kitchen.",
    attribution: "Chizzy",
  },
  {
    type: "heading",
    level: 2,
    text: "Why Gardenscapes Has Me Thinking About All of This",
  },
  {
    type: "paragraph",
    text: "Okay, real talk — I have been deep in Gardenscapes lately (yes, still on that, no I am not ashamed), and there is something about the farming and crafting side of it that genuinely does something to my brain. Making butter from scratch in a game, watching raw ingredients pass through little stages and transform into something new... it just hits differently. The idea that one single raw material can quietly become so many other things feels almost magical when you actually slow down to notice it.",
  },
  {
    type: "paragraph",
    text: "In real life though? I am absolutely going to the store for my butter, my cheese, and my yoghurt — every single time, without a second thought. No judgement at all if you do it from scratch; honestly I respect you enormously and you are living a life I aspire to in theory. But in practice, the fantasy is alive and well in Gardenscapes, and that is more than enough for me. 😂",
  },
  {
    type: "paragraph",
    text: "So next time you open the fridge and reach past the carton without thinking, or spot that tin of evaporated milk at the back of the cupboard, give it a second. It is quietly capable of becoming almost anything — and that, in my book, makes it one of the most interesting ingredients in existence.",
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const token = execSync("gcloud auth print-access-token").toString().trim();
  const now = new Date();

  const docData = {
    id: SLUG,
    title: "Milk: The Most Versatile Ingredient in Any Kitchen",
    slug: SLUG,
    excerpt:
      "Liquid or powdered, full cream or skim — milk shows up everywhere, from sweet custards to savoury sauces, and quietly transforms into butter, cheese and yoghurt. Also: why Gardenscapes is making me appreciate it more than ever (but I'm still buying it at the store).",
    coverImage: "",
    postType: "story",
    tags: ["dairy", "milk", "ingredients", "cooking basics", "gardenscapes"],
    content,
    author: "Chizzy",
    status: "published",
    featured: true,
    includeInNewsletter: false,
    readTime: 4,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };

  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/blogPosts/${SLUG}`;
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
    throw new Error(`Failed to seed post: ${res.status} ${body}`);
  }

  console.log(`Seeded: ${SLUG}`);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
