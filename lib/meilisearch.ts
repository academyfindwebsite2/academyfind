// lib/meilisearch.ts

import { Meilisearch } from "meilisearch";
import dotenv from "dotenv"

dotenv.config()

export const meili = new Meilisearch({
  host: process.env.MEILI_HOST!,
  apiKey: process.env.MEILI_ADMIN_API_KEY!,
});