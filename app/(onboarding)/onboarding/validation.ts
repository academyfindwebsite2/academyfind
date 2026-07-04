import { z } from "zod";

export const onboardingSchema = z.object({
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