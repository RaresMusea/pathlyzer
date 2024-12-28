"use client";

import { CardWrapper } from "../CardWrapper";
import { ChangePasswordSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { useSearchParams } from "next/navigation";
import { changePassword } from "@/actions/ChangePassword";
import { GenericServerActionResult } from "@/actions/globals/Generics";
import { useRouter } from "next/navigation";

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
        <CardWrapper headerName="Reset password" backButtonText="Back to Login" backButtonHref="/login">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="space-y-4">
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Choose a new password"
                                        disabled={isPending}
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="passwordConfirmation" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Re-enter your new password"
                                        disabled={isPending}
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                    </section>
                    <FormSuccess message={success} hasCloseButton={true} />
                    <FormError message={error} hasCloseButton={true} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};