import * as z from 'zod';

export const FileCreationSchema = z.object({
    newName: z.string()
        .min(1, "File name cannot be empty!")
        .max(40, "File name must be at most 40 characters.")
        .refine((val) => !val.includes('/'), {
            message: "File name cannot contain '/'!",
        })
        .refine((val) => /^(\.[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)$/.test(val), {
            message: "Invalid file name. Must be a valid filename or a dotfile (e.g., .gitignore, file.txt)!",
        })
});

export const DirectoryCreationSchema = z.object({
    newName: z.string()
        .min(1, "Directory name cannot be empty!")
        .max(30, "Directory name must contain at most 30 characters.")
        .refine((val) => !val.includes('/'), {
            message: "Directory name cannot contain '/'!",
        })
        .refine((val) => /^[a-zA-Z0-9._-]+$/, {
            message: "Directory name can only contain letters, numbers, dots, underscores, and hyphens.",
        }),
});