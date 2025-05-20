import { LessonNotFound } from "@/components/misc/not-found/LessonNotFound";

export default async function LessonNotFoundPage() {
    return (
        <LessonNotFound backText="Back to learning path" backUrl="../.." />
    )
}