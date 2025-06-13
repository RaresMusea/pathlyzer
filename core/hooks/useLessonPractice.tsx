import { PracticeSectionForm, PracticeSectionSchema } from "@/schemas/PracticeSectionSchema";
import { LessonPracticeDto, LessonPracticeItemDto } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export const useLessonPractice = (practiceDto?: LessonPracticeDto | null) => {
    const [practiceItems, setPracticeItems] = useState<LessonPracticeItemDto[]>(practiceDto?.items || []);
    const [currentEditableItem, setCurrentEditableItem] = useState<LessonPracticeItemDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("edit");
    const [isPending, startTransition] = useTransition();

    const form = useForm<PracticeSectionForm>({
        resolver: zodResolver(PracticeSectionSchema),
        defaultValues: {
            title: currentEditableItem?.title || "Practice item title",
            content: currentEditableItem?.content || "Practice item content",
            duration: currentEditableItem?.duration || 10,
        },
    });


    return {
        setCurrentEditableItem,
        activeTab,
        isEditing,
        isPending,
        practiceItems,
        currentEditableItem,
        setActiveTab,
        form
    };

}