"use client";

import { CardWrapper } from "../CardWrapper";
import { LoginSchema } from "@/schemas/AuthValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import * as z from 'zod';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSucces, FormSuccess } from "../FormSuccess";


export const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    return (
        <CardWrapper headerName="Welcome Back! Sign in into your account" backButtonText="Don't you have an account? Register now!" backButtonHref="/register" socialOptionsEnabled>
            <Form {...form}>
                <form
                    className="space-y-6" 
                    onSubmit={form.handleSubmit(() => {})}>
                        <section className="space-y-4">
                            <FormField control={form.control} name="email" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field} 
                                        placeholder="Enter your email address"
                                        type="email"
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="password" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field} 
                                        placeholder="Enter your password"
                                        type="password"
                                        />
                                    </FormControl>
                                    <FormMessage></FormMessage>
                                </FormItem>
                            )} />
                        </section>
                        <FormSuccess message="" />
                        <FormError message="" />
                        <Button type="submit" className="w-full">
                            Log In
                        </Button>
                </form>
            </Form>
        </CardWrapper>

    );
}