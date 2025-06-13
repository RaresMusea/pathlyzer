"use client";

import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const LessonDeletionModal = ({ open, lessonId, setOpen, lessonTitle }: { open: boolean, lessonId: string, setOpen: (newState: boolean) => void, lessonTitle: string }) => {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const handleDeletion = async () => {
        startTransition(async () => {
            try {
                const response = await axios.delete(`/api/admin/lessons/${lessonId}`);

                if (response.status === 200) {
                    toast.success(response.data.message);
                    setOpen(false);
                    setTimeout(() => router.refresh(), 100);
                }
                else {
                    toast.error(response.data.message);
                }
            } catch (error) {

                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Unexpected error occurred during unit deletion.");
                } else {
                    toast.error("An unexpected error occurred. Please try again later.");
                }
                console.error(error);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <>
                    <motion.div
                        className="font-nunito"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <DialogHeader>
                            <DialogTitle>Confirm deletion</DialogTitle>
                            <DialogDescription>
                                <div className="mt-3">
                                    Are you absolutely sure that you want to completely remove lesson <strong>&quot;{lessonTitle}&quot;</strong> ?<br /><br/> All the evaluation items linked to this entity will also get deleted!<br /> This acction is irreversible!
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            {pending ?
                            <LoadingButton variant="destructive" className="bg-red-400 text-white">Deleting lesson...</LoadingButton> : 
                            <Button variant="destructive" onClick={handleDeletion}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            }
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