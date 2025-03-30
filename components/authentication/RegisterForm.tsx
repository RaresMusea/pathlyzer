"use client";

import { register } from "@/actions/Register";
import { RegisterSchema } from "@/schemas/AuthValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import React from "react";
import { Input } from "../ui/input";
import { AlertType, AuthAlert } from "./Alerts";
import { Button } from "../ui/button";
import Link from "next/link";
import { InviewType } from "../hero-section/InView";

export const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            username: "",
            passwordConfirmation: ""
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setSuccess("");
        setError("");

        startTransition(() => {
            register(values)
                .then(data => {
                    setError(data.error);
                    setSuccess(data.success);
                })
        });
    };

    return (
        <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Hello!</h1>
                        <p className="text-balance text-muted-foreground">
                            Create a Pathlyzer account
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <React.Fragment>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Enter your full name"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} />
                        </React.Fragment>
                    </div>
                    <div className="grid gap-2">
                        <React.Fragment>
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Enter your username"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} />
                        </React.Fragment>
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
                                            type="text"
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
                                    <FormLabel>Password</FormLabel>
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
                    <div className="grid gap-2">
                        <React.Fragment>
                            <FormField control={form.control} name="passwordConfirmation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Confirm your password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} />
                        </React.Fragment>
                    </div>
                    <AuthAlert message={success} hasCloseButton={true} type={AlertType.SUCCESS} inviewType={InviewType.NONE} />
                    <AuthAlert message={error} hasCloseButton={true} type={AlertType.ERROR} inviewType={InviewType.NONE} />
                    <Button type="submit" className="w-[60%] text-center m-auto font-extrabold">
                        Register
                    </Button>
                    <div className="text-center text-sm">
                        Have an account? already?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Sign in.
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
};