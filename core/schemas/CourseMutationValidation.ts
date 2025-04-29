import { z } from "zod";
import { CourseDifficulty } from "@prisma/client";

export const CourseMutationSchema = z.object({
    name: z
        .string()
        .min(1, { message: "The course name is mandatory!" })
        .max(80, { message: "The course name cannot exceed 80 characters." }),

    description: z
        .string()
        .min(1, { message: "The course description is mandatory!" })
        .max(200, { message: "The course description cannot exceed 200 characters." }),

    image: z.string().refine((val) => {
        return val.startsWith('http') || val.startsWith('data:image/');
    }, {
        message: "Please upload a valid image or select an existing one.",
    }),

    difficulty: z.nativeEnum(CourseDifficulty, {
        required_error: "Please select a difficulty level.",
    }),

    availability: z.boolean({
        invalid_type_error: "Availability must be either true or false.",
    }),

    tags: z
        .array(z.object({
            id: z.string(),
            name: z.string()
        }))
        .min(1, { message: "Please select at least one tag." })
        .max(10, { message: "You can select up to 10 tags." }),
});
