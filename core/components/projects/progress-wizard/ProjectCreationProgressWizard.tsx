"use client";

import { Progress } from "@/components/ui/progress";
import { useProjectCreator } from "@/context/ProjectCreatorContext";
import { Check, Code, Package, Server } from "lucide-react";
import Image from "next/image";
import { TerminalLayout } from "./TerminalLayout";
import { AnimatePresence, motion } from "framer-motion";
import { getLogoBasedOnTech } from "@/exporters/LogoExporter";
import { useTheme } from "next-themes";

const creationWizardVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -20,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 300,
        },
    },
}

export const ProjectCreationProgressWizard = () => {
    const { creating, creationComplete, showProgressWizard, loadingStep, projectConfig, getSelectedTemplate, progress, loadingDetails } = useProjectCreator();
    const theme = useTheme().theme || 'light';
    

    return (
        <>
            <AnimatePresence>
                {
                    creating && showProgressWizard && (
                        <motion.div
                            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={creationWizardVariants}>
                            <motion.div
                                className="max-w-md w-full space-y-8 p-6 bg-card rounded-lg border shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: 0.1 }
                                }}>
                                <div className="text-center">
                                    <motion.h2
                                        className="text-2xl font-bold mb-2"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { delay: 0.2 },
                                        }}>
                                        {loadingStep}
                                    </motion.h2>
                                    <motion.p
                                        className="text-muted-foreground mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { delay: 0.3 },
                                        }}
                                    >
                                        {loadingDetails}
                                    </motion.p>
                                </div>
                                <div className="relative">
                                    <Progress value={progress} className="h-2 w-full" />
                                    {creationComplete && (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20,
                                                    delay: 0.2,
                                                },
                                            }}
                                        >
                                            <Check className="h-6 w-6 text-primary" />
                                        </motion.div>
                                    )}
                                </div>
                                <div className="pt-4">
                                    {!creationComplete &&
                                        <p className="text-sm text-center text-muted-foreground">{progress > 0 ? `${progress}% complete` : ''}</p>
                                    }
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="grid grid-cols-2 gap-4 cursor-pointer">
                                        <motion.div
                                            className="flex items-start space-x-3 p-3 bg-muted rounded-lg border"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: { delay: 0.4 },
                                            }}
                                        >
                                            <Code className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium">Project</p>
                                                <p className="text-sm text-primary">{projectConfig.name || "New Project"}</p>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-start space-x-3 p-3 bg-muted rounded-lg border"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: { delay: 0.5 },
                                            }}
                                        >
                                            <Server className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium">Environment</p>
                                                <p className="text-sm text-primary">{projectConfig.os || "Not selected"}</p>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-start space-x-3 p-3 bg-muted rounded-lg border"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: { delay: 0.6 },
                                            }}
                                        >
                                            <div className="w-5 h-5 relative mt-0.5">
                                                {projectConfig.template && (
                                                    <Image
                                                        src={getLogoBasedOnTech(getSelectedTemplate()?.label || 'Blank', theme) || "/placeholder.svg?height=20&width=20"}
                                                        alt={getSelectedTemplate()?.label || ""}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                )}
                                                {!projectConfig.template && <Code className="h-5 w-5 text-primary" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Template</p>
                                                <p className="text-sm text-primary">{getSelectedTemplate()?.label || "Not selected"}</p>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-start space-x-3 p-3 bg-muted rounded-lg border"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: { delay: 0.7 },
                                            }}
                                        >
                                            <Package className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium">Dependencies</p>
                                                <p className="text-sm text-primary">
                                                    {projectConfig.dependencies.length > 0
                                                        ? `${projectConfig.dependencies.length} packages`
                                                        : "None"}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                                <TerminalLayout />
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </>
    );
}