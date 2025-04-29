"use client";

import { CourseDto } from "@/types/types";
import { CourseTag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CourseMutationSchema } from "@/schemas/CourseMutationValidation";
import { saveCourse, CourseManagementResult, updateCourse } from "@/actions/CoursesManagement";
import { toast } from "sonner";

export function useCourseMutator(tags: CourseTag[], course?: CourseDto) {
    const router = useRouter();

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

    useEffect(() => {
        if (course) {
            form.reset({
                name: course.name,
                description: course.description,
                difficulty: course.difficulty,
                availability: course.available,
                image: course.imageSrc || '',
                tags: course.tags,
            });

            setImagePreview(course.imageSrc || null);
        }
    }, [course, form]);

    const [isPending, startTransition] = useTransition();
    const [imagePreview, setImagePreview] = useState<string | null>(course?.imageSrc || null);
    const [errors, setErrors] = useState<boolean>(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setImagePreview(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        form.setValue('image', '');
    };

    const onSubmit = (values: z.infer<typeof CourseMutationSchema>) => {
        if (!course || !course.id) {
            startTransition(async () => {
                const success = await handleCourseSave(values);

                if (success) {
                    router.push('/admin/courses');
                }
            });
        } else {
            startTransition(async () => {
                const success = await handleCourseUpdate(values);
                
                if (success) {
                    router.push('/admin/courses');
                }
            });
        }
    };

    const handleMutationOutput = (output: CourseManagementResult) => {
        if (output.isValid) {
            toast.success(output.message);
        } else {
            toast.error(output.message);
        }

        return output.isValid;
    }

    const handleCourseSave = async (values: z.infer<typeof CourseMutationSchema>): Promise<boolean> => {
        const data = await saveCourse(values);
        return handleMutationOutput(data);
    };

    const handleCourseUpdate = async (values: z.infer<typeof CourseMutationSchema>): Promise<boolean> => {
        const data = await updateCourse(course?.id, values);
        return handleMutationOutput(data);
    }

    return {
        router,
        form,
        imagePreview,
        errors,
        handleImageUpload,
        removeImage,
        isPending,
        onSubmit,
    };
}
