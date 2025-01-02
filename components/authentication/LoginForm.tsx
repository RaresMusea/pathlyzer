"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialAuthMethods } from "./SocialAuthMethods"
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Form } from "../ui/form";
import { LoginSchema } from "@/schemas/AuthValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login, LoginResult } from "@/actions/Login";
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AlertType, AuthAlert } from "./Alerts";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [show2FA, setShow2FA] = useState<boolean>(false);
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "The email was already used for logging in another account, with a different provider!" : "";

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
                    setError(`Something went wrong while attempting to log you in.\nMore details: ${e}.`);
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
                                Login to your Pathlyzer account
                            </p>
                        </div>
                        {!show2FA && (
                            <>
                                <div className="grid gap-2">
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
                                    </React.Fragment>
                                </div>
                                <div className="grid gap-2">
                                    <React.Fragment>
                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center">
                                                    <FormLabel>Password</FormLabel>
                                                    <Link href="/reset" className="ml-auto text-sm underline-offset-2 hover:underline">
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="Enter your password"
                                                        type="password"
                                                    />
                                                </FormControl>
                                                <FormMessage></FormMessage>
                                            </FormItem>
                                        )} />
                                    </React.Fragment>
                                </div>
                            </>
                        )}
                        {show2FA && (
                            <div className="grid gap-2">
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
                        <AuthAlert message={success} hasCloseButton={true} type={AlertType.SUCCESS} />
                        <AuthAlert message={error || urlError} hasCloseButton={true} type={AlertType.ERROR} />
                        <Button type="submit" className="w-[60%] text-center m-auto font-extrabold">
                            Login
                        </Button>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <SocialAuthMethods />
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}