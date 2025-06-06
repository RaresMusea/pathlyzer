"use client";

import RetroGrid from "@/components/ui/retro-grid";
import { TypewriterEffect } from "@/components/ui/typewritter-effect";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";


export const Pathgrid = ({ session }: { session: Session | null }) => {
    const router = useRouter();
    const [buttonText, setButtonText] = useState<string>('');

    const words = [
        {
            text: "Forge",
        },
        {
            text: "your",
        },
        {
            text: "path",
        },
        {
            text: "in",
        },
        {
            text: "software",
        },
        {
            text: "development",
        },
        {
            text: "with"
        },
        {
            text: "Pathlyzer.",
            className: "text-[#1D63ED] dark:text-[#E5F2FC] font-bolder",
        },
    ];

    useEffect(() => {
        if (!session || !session.user) {
            setButtonText("Start today");
            return;
        }

        setButtonText('Continue journey');

    }, [session])

    const onClick = () => {
        router.push("/register");
    };

    return (
        <div className="relative flex h-[850px] w-full flex-col items-center justify-center overflow-hidden">
            <TypewriterEffect words={words} className="mt-4 mx-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-nunito" />
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center m-3 font-nunito">Pathlyzer helps you shape your tech career with personalized learning paths, interactive quizzes, and milestones that accelerate your growth.</span>
            {buttonText === '' ?
                <Button disabled className="mt-4 bg-[#1D63ED] dark:bg-[#00084D] text-white w-60 p-6 font-bold text-lg">
                    <Loader2 className="animate-spin mr-2" />
                    Please wait
                </Button>
                :
                <Button onClick={() => onClick()} className="mt-4 bg-[#1D63ED] dark:bg-[#00084D] text-white w-60 p-6 font-bold text-lg">{buttonText}</Button>
            }
            <RetroGrid />
        </div>
    );
}