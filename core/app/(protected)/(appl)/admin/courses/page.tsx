import { getCourses } from "@/app/service/course/courseService";
import { ManageCoursesPageWrapper } from "@/components/admin/courses/ManageCoursesPageWrapper";
import { CourseDto } from "@/types/types";

export default async function ManageCoursesPage() {
    const courses: CourseDto[] = await getCourses();

    return (
        <div className="container mx-auto py-10">
            <ManageCoursesPageWrapper courses={courses} />
        </div>
    )
}