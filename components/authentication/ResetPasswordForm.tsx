"use client";

import { PasswordResetSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PasswordResetResult, resetPassword } from "@/actions/PasswordReset";
import React from "react";
import { AlertType, AuthAlert } from "./Alerts";
import Link from "next/link";

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
        <>
            <Form {...form}>
                <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Welcome back!</h1>
                            <p className="text-balance text-muted-foreground">
                                Request a password reset
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <React.Fragment>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email address</FormLabel>
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
                            </React.Fragment>
                        </div>
                        <AuthAlert message={success} hasCloseButton={true} type={AlertType.SUCCESS} />
                        <AuthAlert message={error} hasCloseButton={true} type={AlertType.ERROR} />
                        <Button type="submit" className="w-[60%] text-center m-auto font-extrabold">
                            Request password reset
                        </Button>
                        <div className="text-center text-sm">
                            <Link href="/login" className="underline underline-offset-4">
                                Back to login
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};