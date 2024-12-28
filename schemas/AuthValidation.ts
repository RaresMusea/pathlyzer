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
    username: z.string().min(4, {
        message: "The username must contain at least 4 characters."
    }).max(30, {
        message: "The username cannot be longer than 30 characters."
    }).refine((value) => !/\s/.test(value), {
        message: "The username must not contain spaces."
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

export const PasswordResetSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address."
    }),
});

export const ChangePasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum password length is 6 characters."
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