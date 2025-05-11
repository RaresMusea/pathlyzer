import { UnitMutationValidator } from "@/schemas/UnitMutationValidation";
import { UnitMutationDto } from "@/types/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTransition } from "react";

export function useUnitMutator(unit?: UnitMutationDto) {
    const router = useRouter();

    const form = useForm<z.infer<typeof UnitMutationValidator>>({
        resolver: zodResolver(UnitMutationValidator),
        defaultValues: unit || {
            name: "",
            description: "",
        }
    });

    const [isPending, startTransition] = useTransition();

    return {
        form,
        router,
        isPending
    };
}