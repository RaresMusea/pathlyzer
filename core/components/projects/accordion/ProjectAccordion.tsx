"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { ProjectData } from "@/types/types";
import Image from "next/image";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";

export const ProjectAccordion = (project: ProjectData) => {
    const theme = useTheme().theme;

    return (
        <Accordion variant="bordered" className="w-full" isCompact motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: "auto",
                overflowY: "unset",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                overflowY: "hidden",
                transition: {
                  height: {
                    easings: "ease",
                    duration: 0.25,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 0.3,
                  },
                },
              },
            },
          }}>
            {project.description ? (
                <AccordionItem key="badgeInfo" aria-label="About" title="About" subtitle="Read more about this project">
                    {project.description}
                </AccordionItem>
            ) : null}
            <AccordionItem key="techStack" aria-label="Technologies" title="Technologies" subtitle="Language & frameworks used within this project">
                <div className="flex items-center justify-between">
                    <span>Template / Language: {project.template}</span>
                    <Image src={getLogoBasedOnTech(project.template, theme || 'light')} width={25} height={25} alt="Template logo" className="mr-2" />
                </div>
                <div className="flex items-center justify-between pt-3 mb-2">
                    <span>Framework: {project.framework}</span>
                    <Image src={getLogoBasedOnTech(project.framework || '', theme || 'light')} width={25} height={25} alt="Template logo" className="mr-2" />
                </div>
            </AccordionItem>
        </Accordion>
    )
}