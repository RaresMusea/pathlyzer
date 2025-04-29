import { getCourseById, getCourseTags } from "@/app/service/course/courseService";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto } from "@/types/types";
import { CourseTag } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function EditCoursePage({ searchParams }: {
    searchParams: Promise<{ courseId: string }>
}) {

    const courseId: string | undefined = decodeURIComponent((await searchParams).courseId);

    if (!courseId) {
        notFound();
    }

    const requestedCourse: CourseDto | undefined = await getCourseById(courseId);
    const courseTags: CourseTag[] = await getCourseTags();

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
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Edit course - {requestedCourse.name}</h1>
                </div>
                <CourseForm course={requestedCourse} tags={courseTags} />
            </div>
        </PageTransition>
    )
}

export default EditCoursePage;