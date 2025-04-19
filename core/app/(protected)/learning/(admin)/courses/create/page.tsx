import { CourseBuilder } from "@/components/learning/courses/CourseBuilder";
import { CourseBuilderProvider } from "@/context/CourseBuilderContext";

const CourseCreationPage = () => {
    return (
        <div className="mt-12 min-h-screen text-black dark:text-white bg-background">
            <CourseBuilderProvider>
                <CourseBuilder />
            </CourseBuilderProvider>
        </div>
    );
}

export default CourseCreationPage