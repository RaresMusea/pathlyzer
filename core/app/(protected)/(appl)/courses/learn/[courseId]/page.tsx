import { PageTransition } from "@/components/misc/animations/PageTransition";

export default async function CoursePathPage({ params, }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    return (
        <PageTransition>
            <div>CourseId: {courseId}</div>
        </PageTransition>
    );
}