import CourseNotFound from "@/components/admin/courses/CourseNotFound"

export default async function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <CourseNotFound />
        </div>
    )
}