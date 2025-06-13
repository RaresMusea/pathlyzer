import { getCourseById } from "@/app/service/learning/course/courseService";
import { getLessonById, lessonExists } from "@/app/service/learning/lessons/lessonService";
import { getLessonPracticeByLessonId } from "@/app/service/learning/lessons/practice/lessonPracticeService";
import { LessonPracticeForm } from "@/components/admin/courses/learning-path-management/lesson/practice/LessonPracticeForm";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseDto, LessonPracticeDto } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ManageLessonPracticePage({ params, }: { params: Promise<{ courseId: string, lessonId: string }> }) {
    const { courseId, lessonId } = await params;

    const course: CourseDto | undefined = await getCourseById(courseId);
    const lessonPractice: LessonPracticeDto | null = await getLessonPracticeByLessonId(lessonId);
    const lesson = await getLessonById(lessonId);

    if (!courseId || !lessonId || ! await lessonExists(lessonId) || !lesson) {
        return notFound();
    }

    return (
        <PageTransition>
            <div className="container mx-auto w-full">
                <div className="mb-6 ml-3">
                    <Link href="../../">
                        <Button variant="outline" size="sm">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to learning path management
                        </Button>
                    </Link>
                </div>
                <LessonPracticeForm practiceDto={lessonPractice} lessonName={lesson.title} />
            </div>
        </PageTransition>
    )
}