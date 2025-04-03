"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProjectCreator } from "@/context/ProjectCreatorContext";
import { ChevronLeft, ChevronRight, FolderOpenDot, PlusCircle } from "lucide-react";
import { CreateProjectModalSidebar } from "./modal/CreateProjectModalSidebar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { ProjectCreationProgressWizard } from "./progress-wizard/ProjectCreationProgressWizard";

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0,
        padding: '3px',
    }),
    center: {
        x: 0,
        opacity: 1,
        padding: '3px'
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -500 : 500,
        opacity: 0,
        padding: '3px',
    }),
}

const transition = {
    type: "spring",
    stiffness: 500,
    damping: 40,
}

export const CreateProject = () => {
    const { open, setOpen, creating, steps, direction, currentStep, nextStep, previousStep, renderCustomCreationStep, handleClose, handleProjectCreation } = useProjectCreator();

    return (
        <>
            <Button className="bg-[#00084D] text-white hover:bg-[#1D63ED] dark:bg-[#1D63ED] dark:hover:bg-[#00084D] " onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
            </Button>

            <Dialog open={open} onOpenChange={(state: boolean) => !state ? handleClose() : setOpen(true)}>
                <DialogContent className="sm:max-w-[800px] w-full p-0 overflow-hidden">
                    <div className="flex h-[600px]">
                        <CreateProjectModalSidebar />
                        <div className="flex flex-1 flex-col">
                            <DialogHeader className="p-6 pb-0">
                                <DialogTitle>
                                    {currentStep === 1 ? steps[0].title : steps[currentStep - 1].title}
                                </DialogTitle>
                                <DialogDescription>
                                    {steps[currentStep - 1].description}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-6 flex-1 overflow-auto noScroll">
                                <AnimatePresence initial={false} custom={direction} mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={transition}
                                        className="h-full overflow-auto noScroll"
                                    >
                                        {renderCustomCreationStep()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <DialogFooter className="p-3 border-t flex items-center">
                                <div className="flex justify-between w-full items-center">
                                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                                    <div className="flex gap-2">
                                        {
                                            currentStep !== 1 &&
                                            <Button type="submit" onClick={previousStep}>
                                                <ChevronLeft />
                                                Back
                                            </Button>
                                        }
                                        {
                                            currentStep !== 2 ?
                                                <Button type="submit" onClick={nextStep}>
                                                    Next
                                                    <ChevronRight />
                                                </Button>
                                                :
                                                <Button type="submit" onClick={async () => await handleProjectCreation()}>
                                                    Create Project
                                                    <FolderOpenDot />
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {
                creating &&
                <ProjectCreationProgressWizard />
            }
        </>
    );
}