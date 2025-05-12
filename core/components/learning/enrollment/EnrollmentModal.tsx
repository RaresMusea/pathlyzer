"use client";

import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

type EnrollmentModalProps = {
    courseId: string | null;
    courseTitle: string | null;
    open: boolean;
    pending: boolean;
    setOpen: () => void;
    action: () => void;
}

export const EnrollmentModal = ({ courseTitle, open, setOpen, action, pending }: EnrollmentModalProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="font-nunito max-w-[700px]">
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Enrollment: {courseTitle}</DialogTitle>
                            <DialogDescription>
                                <p className="text-sm mt-3">You&apos;re about to enroll in this course.<br />
                                    Once enrolled, you&apos;ll gain full access to all lessons, quizzes, and track your learning progress.</p>
                                <p className="font-bold text-md mt-2">After enrolling:</p>
                                <ul className="list-disc pl-5 mb-3">
                                    <li>
                                        You&apos;ll start from the first available unit.
                                    </li>
                                    <li>
                                        You can always resume where you left off.
                                    </li>
                                    <li>After each lesson you will take an exam to prove your knowledge</li>
                                </ul>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            {pending ?
                                <LoadingButton >Enrolling...</LoadingButton>
                                :
                                <Button className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] transition-colors text-white" onClick={() => action()}>
                                    Enroll now
                                </Button>
                            }
                            <Button variant="outline" onClick={() => setOpen()}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </motion.div>
                </>
            </DialogContent>
        </Dialog>
    )
}