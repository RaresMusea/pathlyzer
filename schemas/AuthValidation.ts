import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address."
    }),
    password: z.string().min(1, {
        message: "The password cannot be empty"
    })
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address."
    }),
    password: z.string().min(6, {
        message: "Minimum password length is 6 characters."
    }),
    name: z.string().min(3, {
        message: "The name must be at least 3 characters long."
    }).max(15, {
        message: "The name cannot be longer than 15 characters."
    }),
    passwordConfirmation: z.string().min(6, {
        message: "The password confirmation cannot be empty"
    })
}).superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["passwordConfirmation"],
            message: "Passwords do not match."
        });
    }
});