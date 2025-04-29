"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "motion/react";

type CourseDeletionDialogProps = {
    open: boolean;
    setOpen: (newState: boolean) => void;
    courseTitle: string;
    action: () => void;
}

export const CourseDeletionDialog = ({ open, setOpen, courseTitle, action }: CourseDeletionDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Confirm deletion</DialogTitle>
                            <DialogDescription>
                                Are you absolutely sure that you want to completely remove course &quot;{courseTitle}&quot;? All the units and lessons linked to this course will also get deleted! This acction is irreversible!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="destructive" onClick={() => action()}>
                                Delete
                            </Button>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </motion.div>
                </>
            </DialogContent>
        </Dialog>
    )
}