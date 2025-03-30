"use client";

import { Button } from "@/components/ui/button";
import { useProjectCreator } from "@/context/ProjectCreatorContext";
import { motion } from "framer-motion";

export const TerminalLayout = () => {
    const { loadingStep, projectConfig, progress, loadingDetails, setOpen, setCreating, setCurrentStep, abortCreation } = useProjectCreator();
    const errorCheck: boolean = loadingStep.includes('error');

    return (
        <>
            {errorCheck && (
                <>
                    <motion.div className="bg-black text-red-600 font-extrabold p-3 rounded-lg font-mono text-xs h-24 overflow-y-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}>
                        {progress < 20 && <div className="text-green-400">$ checking if project already exists...</div>}
                        {progress > 20 && <div className="text-green-400">$ initializing project structure...</div>}
                        <div>$ The following error occurred while attempting to create your project: {loadingDetails}</div>
                    </motion.div>
                    <div className="flex justify-center gap-4">
                    <Button onClick={() => { setCreating(false); setOpen(true); setCurrentStep(1); }}>Retry</Button>
                    <Button variant="secondary" onClick={() => { abortCreation() }}>Back to projects</Button>
                    </div>
                </>
            )
            }
            {
                !errorCheck && (
                    <motion.div className="bg-black text-green-400 p-3 rounded-md font-extrabold font-mono text-xs h-24 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
                        <div>$ creating project ${projectConfig.name}...</div>
                        {progress < 20 && <div>$ checking if project already exists...</div>}
                        {progress > 20 && <div>$ creating workspace...</div>}
                        {progress >= 100 && <div className="text-white">✓ Project created successfully!</div>}
                    </motion.div>
                )
            }
        </>
    )
}