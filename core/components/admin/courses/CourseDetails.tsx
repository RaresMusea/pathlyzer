"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCourses } from "@/hooks/useAdminCourses";
import Image from "next/image";
import { getDifficultyColorStyles, getDifficultyLabel } from "@/lib/CourseUtils";
import { CourseDto } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { CourseDeletionDialog } from "./CourseDeletionDialog";

export const CourseDetails = ({ course }: { course: CourseDto }) => {
    const { handleCourseDeletion, confirmDelete, deleteDialogOpen, setDeleteDialogOpen } = useAdminCourses([course]);

    return (
        <div className="space-y-6">
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold">{course.name}</h1>
                <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button asChild variant="outline">
                            <Link href={`/admin/courses/edit?courseId=${encodeURIComponent(course.id)}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="destructive" onClick={() => confirmDelete(course)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                    className="md:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Course details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-muted-foreground">{course.description}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Difficulty level</h3>
                                <Badge variant="outline" className={getDifficultyColorStyles(course.difficulty)}>
                                    {getDifficultyLabel(course.difficulty)}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">User availability</h3>
                                <Badge variant={course.available ? "default" : "secondary"}>
                                    {course.available ? "Available" : "Unavailable"}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    <AnimatePresence>
                                        {course.tags.map((tag) => (
                                            <motion.div
                                                key={tag.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Badge variant="secondary">{tag.name}</Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                                <Image
                                    src={course.imageSrc || "/placeholder.svg"}
                                    alt={course.name}
                                    width={500}
                                    height={300}
                                    className="rounded-md object-cover w-full"
                                />
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Administrative data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-1">Course Identifier</h3>
                                <p className="text-muted-foreground">{course.id}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">Created on</h3>
                                <p className="text-muted-foreground">
                                    {new Date(course.createdAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">Last updated on</h3>
                                <p className="text-muted-foreground">
                                    {new Date(course.updatedAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <CourseDeletionDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} action={handleCourseDeletion} courseTitle={course.name} />
        </div>
    )
}