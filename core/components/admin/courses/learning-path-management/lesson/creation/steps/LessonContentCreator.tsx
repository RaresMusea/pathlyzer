"use client";

import { useLessonBuilder } from "@/context/LessonBuilderContext";
import { LessonEditor } from "../LessonEditor";

export const LessonContentCreator = () => {
    const { editor } = useLessonBuilder();

    return (
        <LessonEditor editor={editor} />
    )
}