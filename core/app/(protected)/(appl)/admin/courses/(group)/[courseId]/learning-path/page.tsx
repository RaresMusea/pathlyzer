import { getCourseById } from "@/app/service/learning/course/courseService";
import { getUnits } from "@/app/service/learning/units/unitService";
import { EmptyPath } from "@/components/admin/courses/learning-path-management/EmptyPath";
import { LearningPathManagementHeader } from "@/components/admin/courses/learning-path-management/LearningPathManagementHeader";
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
                <LearningPathManagementHeader courseName={course.name} courseId={courseId} path={learningPath} />
                {learningPath.length ? learningPath.map((item) => (
                    <div key={item.id} className="mb-10">
                        <AdminUnit unit={item} />
                    </div>
                )) :
                    <EmptyPath />
                }
            </div>
        </PageTransition>
    )
}