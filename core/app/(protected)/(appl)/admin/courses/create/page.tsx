import { getCourseTags } from "@/app/service/learning/course/courseService";
import { auth } from "@/auth";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { CourseTag } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreateCoursePage() {
    const session = await auth();

    if (session?.user.role !== "ADMINISTRATOR") {
        redirect("/unauthorized")
    };

    const courseTags: CourseTag[] = await getCourseTags();

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
                    <h1 className="text-3xl font-bold">Add a new course</h1>
                </div>
                <CourseForm tags={courseTags} />
            </div>
        </PageTransition>
    )
}