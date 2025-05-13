import { getCourseById } from "@/app/service/learning/course/courseService";
import { getUnitOrderById } from "@/app/service/learning/units/unitService";
import { LessonCreator } from "@/components/admin/courses/learning-path-management/lesson/creation/LessonCreator";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseBuilderProvider } from "@/context/CourseBuilderContext";
import { LessonBuilderProvider } from "@/context/LessonBuilderContext";
import { CourseDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AddLessonPage({ params, }: { params: Promise<{ courseId: string, unitId: string }> }) {
    const { courseId, unitId } = await params;
    const course: CourseDto | undefined = await getCourseById(courseId);
    const unitOrder: number | null = await getUnitOrderById(unitId);

    if (!course || !courseId || !unitOrder) {
        return notFound();
    }

    console.log("Course", course);

    return (
        <PageTransition>
            <div className="container mx-auto w-full">
                <div className="mb-6 ml-3">
                    <Link href="../learning-path">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to learning path management
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-between ml-3">
                    <h1 className="text-3xl font-bold">{course.name}, Unit {unitOrder} - New lesson</h1>
                </div>
                <CourseBuilderProvider>
                    <LessonBuilderProvider>
                        <LessonCreator />
                    </LessonBuilderProvider>
                </CourseBuilderProvider>
            </div>
        </PageTransition>
    )
}