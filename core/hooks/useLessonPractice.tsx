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
        reValidateMode:"onChange",
    });

    const addItem = () => {
        const blankItem: LessonPracticeItemDto = {
            id: `item-${Date.now()}`,
            title: 'Practice item title',
            content: 'Practice item content',
            duration: 10
        }

        setPracticeItems([...practiceItems, blankItem]);
        setCurrentEditableItem(blankItem);
        setIsEditing(true);
    };

    const deleteItem = (id: string) => {
        setPracticeItems(practiceItems.filter((item) => item.id !== id))

        if (currentEditableItem?.id === id) {
            setCurrentEditableItem(null);
            setIsEditing(false);
        }

        cancelSelection();
    }

    const updatePracticeItem = (id: string, data: Partial<LessonPracticeItemDto>) => {
        setPracticeItems(items =>
            items.map(it => (it.id === id ? { ...it, ...data } : it))
        );
    }

    const moveItemUp = (index: number) => {
        if (index === 0) return;

        const newItems = [...practiceItems];
        const temp = newItems[index];
        newItems[index] = newItems[index - 1];
        newItems[index - 1] = temp;
        setPracticeItems(newItems);
    }

    const moveItemDown = (index: number) => {
        if (index === (practiceItems.length - 1)) return;

        const newItems = [...practiceItems];
        const temp = practiceItems[index];
        newItems[index] = newItems[index + 1];
        newItems[index + 1] = temp;
        setPracticeItems(newItems);
    }

    const startEditing = (item: LessonPracticeItemDto) => {
        setCurrentEditableItem(item);
        setIsEditing(true);

        form.reset({
            title: item.title,
            content: item.content,
            duration: item.duration,
        });
    }

    const cancelSelection = () => {
        setIsEditing(false);
        setCurrentEditableItem(null);

        form.reset({
            title: "Practice item title",
            content: "Practice item content",
            duration: 10
        });
    }

    const handleValidation = async () => {
        const success: boolean = await form.trigger();
        
        if (success) {
            cancelSelection();
        }
    }

    return {
        form,
        currentEditableItem,
        activeTab,
        isEditing,
        isPending,
        practiceItems,
        moveItemUp,
        moveItemDown,
        handleValidation,
        cancelSelection,
        updatePracticeItem,
        setCurrentEditableItem,
        startEditing,
        setActiveTab,
        addItem,
        deleteItem,
    };
}