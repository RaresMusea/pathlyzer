import { getCourseById } from "@/app/service/learning/course/courseService";
import { UnitForm } from "@/components/admin/courses/learning-path-management/unit/UnitForm";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CreateUnitPage({ params, }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course: CourseDto | undefined = await getCourseById(courseId);

    if (!courseId || !course) {
        notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto">
                <div className="mb-6">
                    <Link href="../learning-path">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to learning path management
                        </Button>
                    </Link>
                </div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">{course.name} - New unit</h1>
                </div>
                <UnitForm />
            </div>
        </PageTransition>
    )
}