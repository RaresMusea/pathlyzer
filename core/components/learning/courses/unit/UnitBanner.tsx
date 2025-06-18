"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheck, Lock, NotebookText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

type UnitBannerProps = {
    title: string;
    description: string;
    isCurrent: boolean;
    isCompleted: boolean;
    currentLessonId: string;
}


export const UnitBanner = ({ title, description, isCompleted, isCurrent, currentLessonId }: UnitBannerProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const containerClass = cn(
        "w-full rounded-xl p-5 text-black dark:text-white flex items-center justify-between transition-colors",
        isCurrent && "bg-[var(--pathlyzer-table-border)] text-white",
        !isCurrent && isCompleted && "bg-muted dark:bg-muted/50",
        !isCurrent && !isCompleted && "bg-muted/70 dark:bg-muted/30"
    );

    const buttonClass = cn(
        "transition-colors text-white",
        isCurrent
            ? "bg-primary-foreground/50 hover:bg-primary-foreground/40"
            : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
    );

    const handleContinuePress = () => {
        router.push(`${pathname}/lesson/${currentLessonId}`);   
    }

    return (
        <div className="container mx-auto md:w-[80%]">
            <div className={containerClass}>
                <div className="space-y-2.5">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-md">{description}</p>
                </div>

                <>
                    {
                        isCurrent && !isCompleted &&
                            <Button className={buttonClass} onClick={handleContinuePress}>
                                <NotebookText className="mr-2" />
                                Continue
                            </Button>
                    }
                    {
                        isCompleted &&
                        <Button className="muted">
                            <CircleCheck className="mr-2" />
                            Completed
                        </Button>
                    }
                    {
                        !isCurrent && !isCompleted &&
                        <Button variant="ghost">
                            <Lock className="mr-2" />
                            Locked
                        </Button>
                    }
                </>
            </div>
        </div>
    );
};