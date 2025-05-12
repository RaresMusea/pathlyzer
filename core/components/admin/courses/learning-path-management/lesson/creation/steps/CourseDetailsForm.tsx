"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { motion } from "framer-motion";
import React from "react";

export const CourseDetailsForm = () => {
    const { form, onSubmit } = useLessonBuilder();

    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className="absolute w-full"
        >
            <div className="grid gap-6 mb-6 w-full">
                <div className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lesson details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <React.Fragment>
                                    <FormField control={form.control} name="details.title" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Provide a title for the lesson"
                                                    type="text"
                                                    maxLength={80}
                                                />
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )} />
                                </React.Fragment>
                            </div>

                            <div className="grid gap-3">
                                <React.Fragment>
                                    <FormField control={form.control} name="details.description" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="What is the purpose of this lesson?"
                                                    rows={5}
                                                    maxLength={150}
                                                />
                                            </FormControl>
                                            <FormMessage></FormMessage>
                                        </FormItem>
                                    )} />
                                </React.Fragment>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    )
}