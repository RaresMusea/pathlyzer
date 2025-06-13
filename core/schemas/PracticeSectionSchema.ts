import { z } from "zod";

export const PracticeSectionSchema = z.object({
  title: z.string().min(5, "The title is too short!").max(100, "The title is too long!"),
  content: z.string().min(10, "The content of the card should contain at least 10 characters!").max(1000, "The content of the card should not exceed 1000 characters!"),
  duration: z.number().min(10, "The minimum duration is 10 seconds!").max(30, "The maximum duration is 30 seconds!"),
});

export type PracticeSectionForm = z.infer<typeof PracticeSectionSchema>;