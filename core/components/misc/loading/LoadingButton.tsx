"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


type LoadingButtonProps = {
} & React.ComponentProps<typeof Button>;

export const LoadingButton = (props: LoadingButtonProps) => {
    return (
        <Button disabled className={`${props.className}`}>
            <Loader2 className={`animate-spin mr-2`} />
            {props.children}
        </Button>
    )
}