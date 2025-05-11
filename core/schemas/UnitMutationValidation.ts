import { z } from "zod";

export const UnitMutationValidator = z.object({
    name: z.string()
        .min(5, "Name must be at least 5 characters long")
        .max(80, "Name must not exceed 80 characters"),
    description: z.string()
        .min(10, "Description must have at least 10 characters.")
        .max(250, "Description must not exceed 250 characters")
});