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

    const onSubmit = async (values: z.infer<typeof CourseMutationSchema>) => {
        if (!course || !course.id) {
            await handleCourseSave(values);
        }
        else {
            await handleCourseUpdate(values);
        }

        if (!errors) {
            setTimeout(() => router.push('/admin/courses'), 100);
        }
    };

    const handleCourseSave = async (values: z.infer<typeof CourseMutationSchema>) => {
        startTransition(() => {
            saveCourse(values)
                .then((data: CourseManagementResult) => {
                    if (data.isValid) {
                        toast.success(data.message);
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((e) => {
                    toast.error("An error occurred while attempting to create the course. Please try again later.");
                    setTimeout(() => {
                        setErrors(true);
                    }, 100);
                });
        });
    }

    const handleCourseUpdate = async (values: z.infer<typeof CourseMutationSchema>) => {
        startTransition(() => {
            updateCourse(course?.id, values)
                .then((data: CourseManagementResult) => {
                    if (data.isValid) {
                        toast.success(data.message);
                    } else {
                        toast.error(data.message);
                    }
                })
                .catch((e) => {
                    toast.error('An error occurred while attempting to create the course. Please try again later.');
                    setTimeout(() => {
                        setErrors(true);
                    }, 100);

                });
        });
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
