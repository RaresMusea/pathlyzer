"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCourseMutator } from "@/hooks/useCourseMutator";
import { CourseDto } from "@/types/types";
import { CourseTag } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { Controller } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multiselect";
import { fromCourseTagsToOptions } from "@/lib/Mapper";

export const CourseForm = ({ course, tags }: { course?: CourseDto, tags: CourseTag[] }) => {
    const { form, onSubmit, router, imagePreview, removeImage, handleImageUpload, isPending } = useCourseMutator(tags, course);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic info</CardTitle>
                                <CardDescription>Provide course basic info</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">
                                    <React.Fragment>
                                        <FormField control={form.control} name="name" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Course name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Give your new course a title"
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="What is the purpose of this course?"
                                                        rows={5}
                                                        maxLength={200}
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Course image</CardTitle>
                                <CardDescription>Upload a cover image for the course</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <React.Fragment>
                                        <FormField control={form.control} name="image" render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    {
                                                        imagePreview ? (
                                                            <motion.div
                                                                className={`relative w-full max-w-md`}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <Image
                                                                    src={imagePreview || "/placeholder.svg"}
                                                                    alt="Preview"
                                                                    width={300}
                                                                    height={200}
                                                                    className="rounded-md object-cover"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    className="absolute top-2 right-2 h-8 w-8"
                                                                    onClick={removeImage}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                className={`flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-10 ${isPending && 'cursor-not-allowed'}`}
                                                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                                <p className="text-sm text-muted-foreground mb-2">Drag & drop an image or</p>
                                                                <Label htmlFor="image-upload" className="cursor-pointer text-primary hover:underline">
                                                                    Select a file
                                                                </Label>
                                                                <Input
                                                                    id="image-upload"
                                                                    type="file"
                                                                    disabled={isPending}
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        handleImageUpload(e, field.onChange);
                                                                    }}
                                                                />
                                                            </motion.div>
                                                        )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </React.Fragment>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Details</CardTitle>
                                <CardDescription>Set the course difficulty and availability</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="difficulty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Difficulty Level</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isPending}>
                                                        <SelectTrigger id="difficulty">
                                                            <SelectValue placeholder="Select difficulty level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                                                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="availability"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Available for enrollment</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        id="available"
                                                        disabled={isPending}
                                                        defaultChecked={field.value}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden w-full">
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                                <CardDescription>Add tags to categorize your course</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3">

                                    <FormItem>
                                        <FormLabel>Add Tags</FormLabel>
                                        <Controller
                                            name="tags"
                                            control={form.control}
                                            defaultValue={[]}
                                            render={({ field }) => (
                                                <MultiSelect
                                                    className="w-full"
                                                    options={fromCourseTagsToOptions(tags)}
                                                    selected={field.value.map((tag) => tag.id)}
                                                    onChange={(selectedIds) => {
                                                        const selectedTags = tags.filter((tag) =>
                                                            selectedIds.includes(tag.id)
                                                        );

                                                        field.onChange(selectedTags);
                                                    }}
                                                    placeholder="Select the course tags..."
                                                    emptyText="No tags were found."
                                                />
                                            )}
                                        />
                                        <FormMessage />
                                    </FormItem>

                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    <AnimatePresence>
                                        {form.watch("tags").map((tag) => (
                                            <motion.div
                                                key={tag.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    {tag.name}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 ml-1 p-0"
                                                        onClick={() => {
                                                            const newTags = form.getValues("tags").filter((t) => t.id !== tag.id);
                                                            form.setValue("tags", newTags);
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                        <span className="sr-only">Remove tag</span>
                                                    </Button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {form.watch("tags").length === 0 && (
                                        <p className="text-sm text-muted-foreground">No tags added</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
                                Cancel
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            {isPending ?
                                <LoadingButton type="submit">{course ? 'Updating course...' : 'Saving course...'}</LoadingButton>
                                :
                                <Button type="submit">{course ? 'Update course' : 'Save course'}</Button>
                            }
                        </motion.div>
                    </div>
                </div>
            </form>
        </Form >
    )
}