"use client";

import { Pathgrid } from "@/components/hero-section/Pathgrid";
import CycleText from "../ui/cycle-text";
import { TechCloud } from "./TechCloud";
import { InviewType, InViewWrapper } from "./InView";
import { SpreadableCards } from "./SpreadableCards";
import { Session } from "next-auth";
import { CodeGroup } from "../learning/courses/course-preview/code-section-preview/CodeGroup";
import { demoGroup } from "@/exporters/CodeExporterHomepage";

export const Homepage = ({ session }: { session: Session | null }) => {

    return (
        <main className="bg-background">
            <Pathgrid session={session} />
            <div className="flex justify-center items-center flex-col">
                <InViewWrapper type={InviewType.NORMAL}>
                    <div className="w-full mt-5">
                        <CycleText wordsList={["Programming", "spoken", "fluently"]} transitionTimeoutMs={1400} />
                    </div>
                    <TechCloud />
                </InViewWrapper>

                <InViewWrapper type={InviewType.NORMAL}>
                    <p className="text-center my-5 mx-4 font-nunito text-base sm:text-base md:text-lg lg:text-lg xl:text-xl">For each learning path, we provide meaningful explanations, along with examples and code snippets in order to enchance and also facilitate your experience!</p>

                    <InViewWrapper type={InviewType.NORMAL}>
                        <CodeGroup id={0} blocks={demoGroup}></CodeGroup>
                    </InViewWrapper>

                    <p className="font-nunito mt-10 mx-3 font-bold text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">The snippets above may look scary at first, don&apos;t they?</p>
                    <p className="font-nunito mt-10 mx-3 font-bold text-center text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl">No need to worry — Pathlyzer is built to empower both novices and experts.</p>
                    <p className="font-nunito mt-10 mx-3 font-bold text-center text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8">How we will do that? Click on the card below to learn more.</p>
                </InViewWrapper>

                <InViewWrapper type={InviewType.NORMAL}>
                    <div className="my-5 mb-10">
                        <SpreadableCards />
                    </div>
                </InViewWrapper>
            </div>
        </main >
    )
};