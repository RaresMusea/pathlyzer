"use client";

import { LoadingButton } from "@/components/misc/loading/LoadingButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { ArrowUpDown, GripVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { UnitRearrangementDto } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UnitsRearrangementModalProps = {
    open: boolean;
    setOpen: (newState: boolean) => void;
    courseId: string;
    courseTitle: string;
    units: UnitRearrangementDto[];
};

export const UnitsRearrangementModal = ({
    open,
    setOpen,
    courseId,
    courseTitle,
    units,
}: UnitsRearrangementModalProps) => {
    const [pending, startTransition] = useTransition();
    const [localUnits, setLocalUnits] = useState<UnitRearrangementDto[]>(units);
    const router = useRouter();

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reordered = [...localUnits];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setLocalUnits(reordered);
    };

    const handleRearrange = async () => {
        if (localUnits) {
            startTransition(async () => {
                try {
                    const response = await axios.patch(`/api/admin/courses/${courseId}/rearrange-units`, {
                        units: localUnits
                    });

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
                        toast.error(error.response?.data?.message || "Unexpected error occurred during units rearrangement.");
                    } else {
                        toast.error("An unexpected error occurred. Please try again later.");
                    }
                    console.error(error);
                }
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="font-nunito max-w-[1200px] overflow-visible">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                >
                    <DialogHeader>
                        <DialogTitle>
                            Rearrange units for course {courseTitle}
                        </DialogTitle>
                        <DialogDescription>
                            <p className="mt-2 mb-6">Use the vertical grip to drag and drop units for rearrangement.</p>
                            <div className="mt-4 mb-4">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable
                                        droppableId="options"
                                        renderClone={(provided, snapshot, rubric) => {
                                            const unit = localUnits[rubric.source.index];
                                            return (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className="flex items-center gap-2 border rounded-md p-3 bg-background z-[9999] shadow-md"
                                                >
                                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {rubric.source.index + 1}. {unit.title}
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-3"
                                            >
                                                {localUnits.map((unit, index) => (
                                                    <Draggable
                                                        key={unit.id}
                                                        draggableId={unit.id}
                                                        index={index}
                                                        disableInteractiveElementBlocking
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className="flex items-center gap-2 border rounded-md p-3 bg-muted"
                                                            >
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab"
                                                                >
                                                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {index + 1}. {unit.title}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        {pending ? (
                            <LoadingButton>Rearranging units...</LoadingButton>
                        ) : (
                            <Button
                                className="bg-[var(--pathlyzer-table-border)] hover:bg-[var(--pathlyzer)] transition-colors text-white"
                                onClick={handleRearrange}
                            >
                                <ArrowUpDown className="mr-2" />
                                Rearrange units
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};