"use client";

import { CourseMutationDto } from "@/types/types";
import { CourseTag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CourseMutationSchema } from "@/schemas/CourseMutationValidation";
import { saveCourse, CourseManagementResult } from "@/actions/CoursesManagement";
import { toast } from "sonner";

export function useCourseMutator(tags: CourseTag[], course?: CourseMutationDto) {
    const router = useRouter();
    const [formData, setFormData] = useState<CourseMutationDto>(
        course || {
            name: "",
            description: "",
            difficulty: "BEGINNER",
            available: false,
            tags: [],
        },
    );

    const form = useForm<z.infer<typeof CourseMutationSchema>>({
        resolver: zodResolver(CourseMutationSchema),
        defaultValues: course || {
            name: "",
            description: "",
            difficulty: "BEGINNER",
            availability: false,
            image: '',
            tags: [],
        }
    });

    const [isPending, startTransition] = useTransition();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState<string>('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string
                setImagePreview(result);
                onChange(result)
            }
            reader.readAsDataURL(file);
        }
    }

    const removeImage = () => {
        setImagePreview(null);
    }

    const updateFormData = (field: keyof CourseMutationDto, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    const addTag = (tagId: string) => {
        const tagToAdd = tags.find((tag) => tag.id === tagId);

        if (tagToAdd && !formData.tags.some((tag) => tag.id === tagId)) {
            updateFormData("tags", [...formData.tags, tagToAdd]);
        }
        setTagInput("");
    }

    const removeTag = (tagId: string) => {
        updateFormData(
            "tags",
            formData.tags.filter((tag) => tag.id !== tagId),
        );
    }

    const onSubmit = (values: z.infer<typeof CourseMutationSchema>) => {
        startTransition(() => {
            saveCourse(values)
                .then((data: CourseManagementResult) => {
                    if (data.isValid) {
                        toast.success(data.message);
                    }
                    else {
                        toast.error(data.message);
                    }
                })
                .catch(e => toast.error(e))
        });

        setTimeout(() => router.push('/admin/courses'), 100);
    }

    return {
        router,
        form,
        formData,
        imagePreview,
        handleImageUpload,
        updateFormData,
        removeImage,
        isPending,
        addTag,
        removeTag,
        onSubmit
    }

}