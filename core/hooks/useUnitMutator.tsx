import { UnitMutationValidator } from "@/schemas/UnitMutationValidation";
import { UnitMutationDto } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";
import { ServerActionResult } from "@/actions/globals/Generics";
import { toast } from "sonner";
import { saveUnit, updateUnit } from "@/actions/UnitManagement";

const LEARNING_PATH_URL_REDIRECT: string = '../learning-path';

export function useUnitMutator(courseId: string, unit?: UnitMutationDto) {
    const router = useRouter();

    const form = useForm<z.infer<typeof UnitMutationValidator>>({
        resolver: zodResolver(UnitMutationValidator),
        defaultValues: unit || {
            name: "",
            description: "",
        }
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof UnitMutationValidator>) => {
        if (!unit || !unit.id) {
            startTransition(async () => {
                const success = await handleUnitSave(values);

                if (success) {
                    router.push(LEARNING_PATH_URL_REDIRECT);
                }
            });
        } else {
            startTransition(async () => {
                if (!unit.id) return;
                const success = await handleUnitUpdate(values, unit.id);

                if (success) {
                    router.push(`../../`);
                }
            });
        }
    };

    const handleUnitSave = async (values: z.infer<typeof UnitMutationValidator>) => {
        const data: ServerActionResult = await saveUnit(values, courseId);
        return handleMutationOutput(data);
    }

    const handleUnitUpdate = async (values: z.infer<typeof UnitMutationValidator>, unitId: string) => {
        const data: ServerActionResult = await updateUnit(values, unitId);
        return handleMutationOutput(data);
    }

    const handleMutationOutput = (output: ServerActionResult) => {
        if (output.success) {
            toast.success(output.message);
        } else {
            toast.error(output.message);
        }

        return output.success;
    }

    return {
        form,
        router,
        isPending,
        onSubmit
    };
}