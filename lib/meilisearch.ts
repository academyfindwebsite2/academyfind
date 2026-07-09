// lib/meilisearch.ts

import { Meilisearch } from "meilisearch";
import dotenv from "dotenv"

import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// Fallback if running from scripts directory
if (!process.env.MEILI_HOST) {
  dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
}

export const meili = new Meilisearch({
  host: process.env.MEILI_HOST!,
  apiKey: process.env.MEILI_ADMIN_API_KEY!,
});