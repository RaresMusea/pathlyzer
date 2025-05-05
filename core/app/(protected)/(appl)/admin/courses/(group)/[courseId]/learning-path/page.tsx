import { getCourseById } from "@/app/service/learning/course/courseService";
import { getUnits } from "@/app/service/learning/units/unitService";
import { AdminUnit } from "@/components/admin/courses/learning-path-management/unit/AdminUnit";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto, CourseUnitDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ManageLearningPathPage({ params, }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const learningPath: CourseUnitDto[] | null = await getUnits(courseId);
    const course: CourseDto | undefined = await getCourseById(courseId);


    if (!courseId || !learningPath || !course) {
        notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 space-y-8 sticky">
                <div className="mb-6">
                    <Link href="/admin/courses">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to courses
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h1 className="text-2xl font-semibold">{course?.name} - Learning Path Management</h1>
                    </div>
                </div>

                {learningPath.map((item) => (
                    <div key={item.id} className="mb-10">
                        <AdminUnit unit={item} />
                    </div>
                ))}
            </div>
        </PageTransition>
    )
}