import { getCourses } from "@/app/service/course/courseService";
import { auth } from "@/auth";
import { ManageCoursesPageWrapper } from "@/components/admin/courses/ManageCoursesPageWrapper";
import { CourseDto } from "@/types/types";
import { redirect } from "next/navigation";

export default async function ManageCoursesPage() {
    const session = await auth();

    if (session?.user.role !== "ADMINISTRATOR") {
        redirect("/unauthorized")
    };

    const courses: CourseDto[] = await getCourses();

    return (
        <div className="container mx-auto py-10">
            <ManageCoursesPageWrapper courses={courses} />
        </div>
    )
}