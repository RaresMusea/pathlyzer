"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "../CardWrapper";
import { LoginSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login, LoginResult } from "@/actions/Login";
import Link from "next/link";
import React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";


export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "The email was already used for logging in another account, with a different provider!" : "";

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [show2FA, setShow2FA] = useState<boolean>(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setSuccess("");
        setError("");

        startTransition(() => {
            login(values)
                .then((data: LoginResult | undefined) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }
                    if (data?.success) {
                        form.reset();
                        setSuccess(data?.success);
                    }

                    if (data?.twoFactor) {
                        setShow2FA(true);
                    }
                })
                .catch(e => {
                    setError("Something went wrong while attempting to log you in.");
                })
        });
    }

    return (
        <CardWrapper headerName="Welcome Back! Sign in into your account" backButtonText="Don't you have an account? Register now!" backButtonHref="/register" socialOptionsEnabled>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="space-y-4">
                        {!show2FA && (
                            <React.Fragment>
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

                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter your password"
                                                disabled={isPending}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                        <Button size="sm" variant="link" asChild className="px-0 font-normal">
                                            <Link href="/reset">Forgot password?</Link>
                                        </Button>
                                    </FormItem>
                                )} />
                            </React.Fragment>
                        )}
                        {show2FA && (
                            <div className="flex items-center justify-center">
                                <FormField control={form.control} name="twoFactorOtp" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type in the OTP Code provided via email</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                                <InputOTPGroup>
                                                    {Array.from({ length: 6 }).map((_, index) => (
                                                        <React.Fragment key={index}>
                                                            <InputOTPSlot data-otp-slot
                                                                index={index}
                                                                className="font-extrabold"
                                                            />
                                                            {index < 5 && <InputOTPSeparator />}
                                                        </React.Fragment>
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )} />
                            </div>
                        )}
                    </section>
                    <FormSuccess message={success} />
                    <FormError message={error || urlError} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {show2FA ? 'Confirm' : 'Log In'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}