"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { CoursesTable } from "../../tables/CoursesTable";
import { LoadingSpinner } from "../../misc/animations/LoadingSpinner";
import { CourseDto } from "@/types/types";

function LoadingTableSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-muted-foreground">Loading courses table...</p>
        </div>
    )
}

export const ManageCoursesPageWrapper = ({courses}: {courses: CourseDto[]}) => {
    return (
        <>
            <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold">Manage Courses</h1>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/admin/courses/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Course
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Suspense fallback={<LoadingTableSkeleton />}>
                    <CoursesTable initialCourses={courses} />
                </Suspense>
            </motion.div>
        </>
    )
}