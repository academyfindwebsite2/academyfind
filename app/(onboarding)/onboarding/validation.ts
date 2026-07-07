import { z } from "zod";

export const onboardingSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  phone: z.string().min(10, "Phone number is required"),

  categories: z
    .array(z.string().cuid())
    .min(1, "Select at least one category"),

  cities: z
    .array(z.string().cuid())
    .min(1, "Select at least one city"),

  notifications: z.object({
    emailOnDm: z.boolean(),

    emailOnNews: z.boolean(),

    emailOnUpdates: z.boolean(),
  }),
});

export type OnboardingInput = z.infer<
  typeof onboardingSchema
>;