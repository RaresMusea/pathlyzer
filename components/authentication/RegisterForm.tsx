"use client";

import { CardWrapper } from "../CardWrapper";
import { LoginSchema, RegisterSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { register } from "@/actions/Register";


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
    }
    return (
        <CardWrapper headerName="Create an account" backButtonText="Have an account already? Sign in now!" backButtonHref="/login">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="Enter your name"
                                        type="text"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />

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
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="passwordConfirmation" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Re-enter your password"
                                        disabled={isPending}
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage></FormMessage>
                            </FormItem>
                        )} />
                    </section>
                    <FormSuccess message={success}/>
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default RegisterForm;