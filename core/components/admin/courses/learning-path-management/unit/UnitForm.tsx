"use client";

import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUnitMutator } from "@/hooks/useUnitMutator";
import { UnitMutationDto } from "@/types/types";
import { motion } from "framer-motion";
import React from "react";

export const UnitForm = ({ courseId, unit }: { courseId: string, unit?: UnitMutationDto }) => {
    const { form, isPending, router, onSubmit } = useUnitMutator(courseId, unit);

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6 mb-6 w-full">
                        <div className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Unit details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3">
                                        <React.Fragment>
                                            <FormField control={form.control} name="name" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Provide a title for the unit"
                                                            type="text"
                                                            maxLength={80}
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage></FormMessage>
                                                </FormItem>
                                            )} />
                                        </React.Fragment>
                                    </div>

                                    <div className="grid gap-3">
                                        <React.Fragment>
                                            <FormField control={form.control} name="description" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="What is the purpose of this unit?"
                                                            rows={5}
                                                            maxLength={250}
                                                            disabled={isPending}
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
                        <div className="flex justify-end gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="button" variant="outline" onClick={() => router.push("../learning-path")}>
                                    Cancel
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {isPending ?
                                    <LoadingButton type="submit">{unit ? 'Updating unit...' : 'Saving unit...'}</LoadingButton>
                                    :
                                    <Button type="submit">{unit ? 'Update unit details' : 'Save unit'}</Button>
                                }
                            </motion.div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}