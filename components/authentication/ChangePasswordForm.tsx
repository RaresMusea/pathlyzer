"use client";

import { ChangePasswordSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { changePassword } from "@/actions/ChangePassword";
import { GenericServerActionResult } from "@/actions/globals/Generics";
import { useRouter } from "next/navigation";
import React from "react";
import { AlertType, AuthAlert } from "./Alerts";
import Link from "next/link";

export const ChangePasswordForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const token = searchParams.get("token") || "";

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        }
    });

    const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
        setSuccess("");
        setError("");
        console.log("Form submitted with values:", values);

        startTransition(() => {
            changePassword(values, token)
                .then((data: GenericServerActionResult | undefined) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
        });

        setTimeout(() => router.push('/login'), 3000);
    };

    return (
        <>
            <Form {...form}>
                <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-2xl font-bold">Welcome back!</h1>
                            <p className="text-balance text-muted-foreground">
                                Change your password
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <React.Fragment>
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Enter your new password"
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage></FormMessage>
                                    </FormItem>
                                )} />
                            </React.Fragment>
                        </div>
                        <div className="grid gap-2">
                            <React.Fragment>
                                <FormField control={form.control} name="passwordConfirmation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New password confirmation</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Confirm your new password"
                                                type="password"
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
                            Change password
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