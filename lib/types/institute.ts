// lib/types/institute.ts
import { Institute, City, Review } from "@prisma/client";

export type InstituteWithDistance = Institute & {
  city: City;
  reviews: Review[];
  distance: string | null;
};