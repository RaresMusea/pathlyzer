"use client";

import { Button } from "@/components/ui/button";
import { CourseUnitDto } from "@/types/types";
import { motion } from "framer-motion";
import { ArrowUpDown, CirclePlus } from "lucide-react";
import { UnitsRearrangementModal } from "./unit/rearrangement/UnitsRearrangementModal";
import { useState } from "react";
import { fromUnitDtoListToRearrangementDtoList } from "@/lib/Mapper";
import Link from "next/link";

export const LearningPathManagementHeader = ({ courseName, path, courseId }: { courseName: string, courseId: string, path: CourseUnitDto[] | null }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold">{courseName} - Learning Path Management</h1>
                {path && path.length > 0 &&
                    <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href={`learning-path/create-unit`}>
                            <Button className="bg-[var(--pathlyzer)] text-white hover:bg-[var(--pathlyzer-table-border)]">
                                <CirclePlus className="mr-2 h-4 w-4" />
                                Add a new unit
                            </Button>
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" onClick={() => setModalOpen(true)}>
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Rearrange units
                            </Button>
                        </motion.div>
                    </div>
                }
            </div>
            {path && path.length > 0 &&
                <UnitsRearrangementModal open={modalOpen}
                    setOpen={setModalOpen}
                    courseTitle={courseName}
                    units={fromUnitDtoListToRearrangementDtoList(path)}
                    courseId={courseId} />
            }
        </div>
    );
}