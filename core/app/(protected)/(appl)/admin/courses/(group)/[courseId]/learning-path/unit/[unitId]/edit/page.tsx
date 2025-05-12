import { getCourseById } from "@/app/service/learning/course/courseService";
import { getSummarizedUnitDataByCourseId } from "@/app/service/learning/units/unitService";
import { UnitForm } from "@/components/admin/courses/learning-path-management/unit/UnitForm";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto, UnitMutationDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditUnitPage({ params }: { params: Promise<{ courseId: string, unitId: string }> }) {
    const { courseId, unitId } = await params;
    const course: CourseDto | undefined = await getCourseById(courseId);
    const unit: UnitMutationDto | null = await getSummarizedUnitDataByCourseId(unitId);

    if (!courseId || !course || !unitId || !unit) {
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
                    <h1 className="text-3xl font-bold">{course.name} - Edit unit {unit.name}</h1>
                </div>
                <UnitForm courseId={courseId} unit={unit} />
            </div>
        </PageTransition>
    );
}