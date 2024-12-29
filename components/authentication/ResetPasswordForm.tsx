"use client";

import { CardWrapper } from "../CardWrapper";
import { PasswordResetSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { PasswordResetResult, resetPassword } from "@/actions/PasswordReset";

export const ResetPasswordForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
  
    const form = useForm<z.infer<typeof PasswordResetSchema>>({
        resolver: zodResolver(PasswordResetSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = (values: z.infer<typeof PasswordResetSchema>) => {
            setSuccess("");
            setError("");

            startTransition(() => {
                resetPassword(values)
                    .then((data: PasswordResetResult | undefined) => {
                        setError(data?.error);
                        setSuccess(data?.success);
                    })
            });
    };

    return (
        <CardWrapper headerName="Reset password" backButtonText="Back to Login" backButtonHref="/login">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Enter your email address"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                    </section>
                    <FormSuccess message={success} hasCloseButton={true} />
                    <FormError message={error} hasCloseButton={true} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Send password reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};