"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronRight, Edit, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UnitDeletionModal } from "./UnitDeletionModal";
import { LessonDto } from "@/types/types";

export const AdminUnitBanner = ({ title, description, unitId, lessons }: { title: string, description: string, unitId: string, lessons: LessonDto[] }) => {
    const [toggled, setToggled] = useState(false);
    const [unitModalOpen, setUnitModalOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="w-full rounded-xl p-5 dark:text-white flex items-center shadow-xl justify-between transition-colors bg-[var(--pathlyzer-table-border)] text-white">
            <div className="space-y-2.5">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-md">{description}</p>
            </div>
            <DropdownMenu modal={false} open={toggled} onOpenChange={setToggled}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" onClick={() => setToggled(true)} className="bg-muted/40 hover:bg-muted/30 text-white hover:text-white border-0">
                        Options
                        <ChevronRight className={`h-5 w-5 ml-2 transition-all ${toggled ? 'rotate-90' : ''}`} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="font-nunito">
                    <DropdownMenuLabel>Unit-specific</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => router.push(`learning-path/unit/${unitId}/edit`)}>
                            <Edit />
                            Edit unit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onSelect={() => setUnitModalOpen(true)}>
                            <Trash2 />
                            Delete unit
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Lesson-specific</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => router.push(`learning-path/unit/${unitId}/create-lesson`)}>
                            <PlusCircle />
                            Add lesson
                        </DropdownMenuItem>
                        {
                            lessons && lessons.length > 2 &&
                            <DropdownMenuItem onSelect={() => router.push(``)}>
                                <ArrowUpDown />
                                Rearrange lessons
                            </DropdownMenuItem>
                        }
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <UnitDeletionModal open={unitModalOpen} unitId={unitId} setOpen={setUnitModalOpen} unitTitle={title} />
        </div>
    )
}