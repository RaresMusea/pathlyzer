import { getCourseById } from "@/app/service/course/courseService";
import { CourseDetails } from "@/components/admin/courses/CourseDetails";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CourseDetailsPage({ searchParams }: { searchParams: Promise<{ courseId: string }> }) {
    const courseId: string | undefined = decodeURIComponent((await searchParams).courseId);

    if (!courseId) {
        notFound();
    }

    const requestedCourse: CourseDto | undefined = await getCourseById(courseId);

    if (!requestedCourse) {
        notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto">
                <div className="mb-6">
                    <Link href="/admin/courses">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to courses
                        </Button>
                    </Link>
                </div>
                <CourseDetails course={requestedCourse} />
            </div>
        </PageTransition>
    )
}