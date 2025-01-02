"use client";

import { useTheme } from "next-themes";
import { Pathgrid } from "@/components/hero-section/Pathgrid";
import CycleText from "../ui/cycle-text";
import { TechCloud } from "./TechCloud";
import { InViewWrapper } from "./InView";
import { TabsDemo } from "./TabsDemo";

export const Homepage = () => {
    const theme = useTheme();
    console.log(theme?.theme);

    return (
        <main>
            <Pathgrid />
            <div className="flex justify-center items-center flex-col">
                <InViewWrapper>
                    <div className="w-full mt-5">
                        <CycleText wordsList={["Programming", "spoken", "fluently"]} transitionTimeoutMs={1400} />
                    </div>
                    <TechCloud />
                    <p className="text-center my-5 mx-4 font-nunito text-base sm:text-base md:text-lg lg:text-lg xl:text-xl">For each learning path, we provide meaningful explanations, along with examples and code snippets in order to enchance and also facilitate your experience!</p>
                </InViewWrapper>
                <TabsDemo />
            </div>
        </main >
    )
};