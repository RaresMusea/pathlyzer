"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type Option = {
    value: string
    label: string
}

interface MultiSelectProps {
    options: Option[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    emptyText?: string
    className?: string
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    emptyText = "No options found.",
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = React.useCallback(
        (value: string) => {
            const updatedSelected = selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value]
            onChange(updatedSelected)
        },
        [selected, onChange],
    )

    const selectedLabels = React.useMemo(() => {
        return selected
            .map((value) => options.find((option) => option.value === value)?.label)
            .filter(Boolean)
            .join(", ");
    }, [selected, options]);

    return (
        <div className="overflow-hidden">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full truncate overflow-hidden justify-between", className)}
                    >
                        <span className="truncate" title={selectedLabels}>
                            {selected.length > 0 ? selectedLabels : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 scrollbar-thin">
                    <Command>
                        <CommandInput placeholder="Search options..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem key={option.value} value={option.label.toLowerCase()} onSelect={() => handleSelect(option.value)}>
                                        <span className="truncate">{option.label}</span>
                                        <Check
                                            className={cn("ml-auto h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}