"use client";

import { useAdminCourses } from "@/hooks/useAdminCourses";
import { CourseDto } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Download, Edit, Eye, Filter, MoreHorizontal, Search, Split, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { getDifficultyColorStyles, getDifficultyLabel } from "@/lib/CourseUtils";
import { Switch } from "../ui/switch";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { CourseDeletionDialog } from "../admin/courses/CourseDeletionDialog";

interface CoursesTableProps {
    initialCourses: CourseDto[]
}

export const CoursesTable = ({ initialCourses }: CoursesTableProps) => {

    const {
        loading,
        totalPages,
        currentPage,
        difficultyFilter,
        visibleColumns,
        dateRangeFilter,
        paginatedCourses,
        courseToDelete,
        massActionDialogOpen,
        availabilityFilter,
        deleteDialogOpen,
        selectedCourses,
        tagFilter,
        itemsPerPage,
        filteredCourses,
        viewMode,
        allTags,
        tableRef,
        selectAll,
        setDateRangeFilter,
        setMassActionDialogOpen,
        setDeleteDialogOpen,
        setSelectedCourses,
        setTagFilter,
        setViewMode,
        setAvailabilityFilter,
        setDifficultyFilter,
        handleSearchChange,
        setSelectAll,
        resetFilters,
        applyFilters,
        toggleColumnVisibility,
        handleExport,
        handleFullSelection,
        toggleSort,
        handleCourseSelect,
        handleItemsPerPageChange,
        confirmDelete,
        handlePageChange,
        getPageNumbers,
        handleCourseDeletion,
        handleMassAction
    } = useAdminCourses(initialCourses);

    return (
        <div className="space-y-4">
            <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search courses..." className="pl-8" onChange={handleSearchChange} />
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex gap-2">
                                <Filter className="h-4 w-4" />
                                Advanced Filters
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] sm:w-[425px] font-nunito">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty-filter">Difficulty Level</Label>
                                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                        <SelectTrigger id="difficulty-filter">
                                            <SelectValue placeholder="Filter by difficulty level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All difficulty levels</SelectItem>
                                            <SelectItem value="BEGINNER">Beginner</SelectItem>
                                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                            <SelectItem value="ADVANCED">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availability-filter">Availability</Label>
                                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                                        <SelectTrigger id="availability-filter">
                                            <SelectValue placeholder="Filter by availability" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="unavailable">Not currently available</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tag-filter">Tag</Label>
                                    <Select value={tagFilter} onValueChange={setTagFilter}>
                                        <SelectTrigger id="tag-filter">
                                            <SelectValue placeholder="Tag filtering" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All tags</SelectItem>
                                            {allTags.map((tag) => (
                                                <SelectItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date Range</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="date-start" className="text-xs">
                                                From
                                            </Label>
                                            <Input
                                                id="date-start"
                                                type="date"
                                                value={dateRangeFilter.start}
                                                onChange={(e) => setDateRangeFilter((prev) => ({ ...prev, start: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="date-end" className="text-xs">
                                                To
                                            </Label>
                                            <Input
                                                id="date-end"
                                                type="date"
                                                value={dateRangeFilter.end}
                                                onChange={(e) => setDateRangeFilter((prev) => ({ ...prev, end: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={resetFilters} size="sm">
                                        Reset
                                    </Button>
                                    <Button onClick={applyFilters} size="sm">
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <>
                        {viewMode === 'table' &&
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Columns</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Columns visibility</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("image")}
                                        onCheckedChange={() => toggleColumnVisibility("image")}
                                    >
                                        Image
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("name")}
                                        onCheckedChange={() => toggleColumnVisibility("name")}
                                        disabled
                                    >
                                        Name
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("difficulty")}
                                        onCheckedChange={() => toggleColumnVisibility("difficulty")}
                                    >
                                        Difficulty
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("tags")}
                                        onCheckedChange={() => toggleColumnVisibility("tags")}
                                    >
                                        Tags
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("available")}
                                        onCheckedChange={() => toggleColumnVisibility("available")}
                                    >
                                        Availability
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={visibleColumns.includes("createdAt")}
                                        onCheckedChange={() => toggleColumnVisibility("createdAt")}
                                    >
                                        Date created
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        }
                    </>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Export</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                <Download className="mr-2 h-4 w-4" />
                                Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("excel")}>
                                <Download className="mr-2 h-4 w-4" />
                                Export as Excel Document (XLSX)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("pdf")}>
                                <Download className="mr-2 h-4 w-4" />
                                Export as PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
                        <TabsList className="grid w-[180px] grid-cols-2">
                            <TabsTrigger value="table">Table</TabsTrigger>
                            <TabsTrigger value="grid">Grid</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </motion.div>

            {selectedCourses.length > 0 && (
                <motion.div
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <span className="text-sm font-medium">
                        {selectedCourses.length} {selectedCourses.length === 1 ? "course was selected." : "courses were selected."}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedCourses([])
                                setSelectAll(false)
                            }}
                        >
                            Cancel selection
                        </Button>
                        <Button variant="default" size="sm" onClick={() => setMassActionDialogOpen(true)}>
                            Mass actions
                        </Button>
                    </div>
                </motion.div>
            )}

            <div ref={tableRef}>
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "grid")}>
                    {loading ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[30px]">
                                            <Skeleton className="h-4 w-4" />
                                        </TableHead>
                                        {visibleColumns.includes("image") && <TableHead className="w-[80px]">Image</TableHead>}
                                        <TableHead>Name</TableHead>
                                        {visibleColumns.includes("difficulty") && <TableHead>Difficulty</TableHead>}
                                        {visibleColumns.includes("tags") && <TableHead>Tags</TableHead>}
                                        {visibleColumns.includes("available") && <TableHead>Availability</TableHead>}
                                        {visibleColumns.includes("createdAt") && <TableHead>Date Created</TableHead>}
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: itemsPerPage }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-4" />
                                            </TableCell>
                                            {visibleColumns.includes("image") && (
                                                <TableCell>
                                                    <Skeleton className="h-10 w-16 rounded-md" />
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Skeleton className="h-4 w-full max-w-[200px]" />
                                            </TableCell>
                                            {visibleColumns.includes("difficulty") && (
                                                <TableCell>
                                                    <Skeleton className="h-6 w-20 rounded-full" />
                                                </TableCell>
                                            )}
                                            {visibleColumns.includes("tags") && (
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Skeleton className="h-6 w-16 rounded-full" />
                                                        <Skeleton className="h-6 w-16 rounded-full" />
                                                    </div>
                                                </TableCell>
                                            )}
                                            {visibleColumns.includes("available") && (
                                                <TableCell>
                                                    <Skeleton className="h-6 w-10 rounded-full" />
                                                </TableCell>
                                            )}
                                            {visibleColumns.includes("createdAt") && (
                                                <TableCell>
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <>
                            <TabsContent value="table" className="mt-0">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[30px]">
                                                    <Checkbox
                                                        checked={selectAll}
                                                        onCheckedChange={handleFullSelection}
                                                        aria-label="Select all courses"
                                                    />
                                                </TableHead>
                                                {visibleColumns.includes("image") && <TableHead className="w-[80px]">Image</TableHead>}
                                                <TableHead>
                                                    <Button variant="ghost" onClick={() => toggleSort("name")} className="flex items-center">
                                                        Name
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                {visibleColumns.includes("difficulty") && (
                                                    <TableHead>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => toggleSort("difficulty")}
                                                            className="flex items-center"
                                                        >
                                                            Difficulty
                                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </TableHead>
                                                )}
                                                {visibleColumns.includes("tags") && <TableHead>Tags</TableHead>}
                                                {visibleColumns.includes("available") && (
                                                    <TableHead>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => toggleSort("available")}
                                                            className="flex items-center"
                                                        >
                                                            Available
                                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </TableHead>
                                                )}
                                                {visibleColumns.includes("createdAt") && (
                                                    <TableHead>
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => toggleSort("createdAt")}
                                                            className="flex items-center"
                                                        >
                                                            Date created
                                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </TableHead>
                                                )}
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedCourses.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7 + (selectAll ? 1 : 0)} className="h-24 text-center">
                                                        No courses found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                <AnimatePresence mode="popLayout">
                                                    {paginatedCourses.map((course) => (
                                                        <motion.tr
                                                            key={course.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -20 }}
                                                            transition={{ duration: 0.2 }}
                                                            className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted`}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedCourses.includes(course.id)}
                                                                    onCheckedChange={() => handleCourseSelect(course.id)}
                                                                    aria-label={`Select course ${course.name}`}
                                                                />
                                                            </TableCell>
                                                            {visibleColumns.includes("image") && (
                                                                <TableCell>
                                                                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                                                        <Image
                                                                            src={course.imageSrc || "/placeholder.svg"}
                                                                            alt={course.name}
                                                                            width={60}
                                                                            height={40}
                                                                            className="rounded-md object-cover"
                                                                        />
                                                                    </motion.div>
                                                                </TableCell>
                                                            )}
                                                            <TableCell className="font-medium">{course.name}</TableCell>
                                                            {visibleColumns.includes("difficulty") && (
                                                                <TableCell>
                                                                    <Badge variant="outline" className={getDifficultyColorStyles(course.difficulty)}>
                                                                        {getDifficultyLabel(course.difficulty)}
                                                                    </Badge>
                                                                </TableCell>
                                                            )}
                                                            {visibleColumns.includes("tags") && (
                                                                <TableCell>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {course.tags.slice(0, 2).map((tag) => (
                                                                            <motion.div
                                                                                key={tag.id}
                                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                                animate={{ opacity: 1, scale: 1 }}
                                                                                transition={{ duration: 0.2 }}
                                                                            >
                                                                                <Badge variant="secondary" className="mr-1">
                                                                                    {tag.name}
                                                                                </Badge>
                                                                            </motion.div>
                                                                        ))}
                                                                        {course.tags.length > 2 && (
                                                                            <Badge variant="outline">+{course.tags.length - 2}</Badge>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                            {visibleColumns.includes("available") && (
                                                                <TableCell>
                                                                    <motion.div whileTap={{ scale: 0.95 }}>
                                                                        <Switch
                                                                            className="[state=checked]:bg-[var(--pathlyzer-table-border)]"
                                                                            disabled
                                                                            checked={course.available}
                                                                            onCheckedChange={() => { }}
                                                                        />
                                                                    </motion.div>
                                                                </TableCell>
                                                            )}
                                                            {visibleColumns.includes("createdAt") && (
                                                                <TableCell>{new Date(course.createdAt).toLocaleDateString("ro-RO")}</TableCell>
                                                            )}
                                                            <TableCell className="text-right">
                                                                <DropdownMenu modal={false}>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="font-nunito">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={`/admin/courses/details?courseId=${encodeURIComponent(course.id)}`}>
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                View details
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={`/admin/courses/edit?courseId=${encodeURIComponent(course.id)}`}>
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={`/admin/courses/${course.id}/learning-path`}>
                                                                                <Split className="mr-2 h-4 w-4" />
                                                                                Manage learning path
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(course)}>
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                            <TabsContent value="grid" className="mt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {paginatedCourses.map((course) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className="overflow-hidden h-full flex flex-col">
                                                    <CardHeader className="p-0 relative">
                                                        <div className="absolute top-2 right-2 z-10">
                                                            <Checkbox
                                                                checked={selectedCourses.includes(course.id)}
                                                                onCheckedChange={() => handleCourseSelect(course.id)}
                                                                aria-label={`Select course ${course.name}`}
                                                                className="bg-white/80"
                                                            />
                                                        </div>
                                                        <Image
                                                            src={course.imageSrc || "/placeholder.svg"}
                                                            alt={course.name}
                                                            width={300}
                                                            height={200}
                                                            className="w-full h-40 object-cover"
                                                        />
                                                    </CardHeader>
                                                    <CardContent className="p-4 space-y-2 flex-grow">
                                                        <h3 className="font-semibold truncate">{course.name}</h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                                                        <div className="flex flex-wrap gap-1 pt-2">
                                                            <Badge variant="outline" className={getDifficultyColorStyles(course.difficulty)}>
                                                                {getDifficultyLabel(course.difficulty)}
                                                            </Badge>
                                                            {course.tags.slice(0, 1).map((tag) => (
                                                                <Badge key={tag.id} variant="secondary">
                                                                    {tag.name}
                                                                </Badge>
                                                            ))}
                                                            {course.tags.length > 1 && <Badge variant="outline">+{course.tags.length - 1}</Badge>}
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="flex justify-between p-4 pt-0">
                                                        <Badge variant={course.available ? "default" : "secondary"}>
                                                            {course.available ? "Available" : "Unavailable"}
                                                        </Badge>
                                                        <DropdownMenu modal={false}>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/courses/details?courseId=${encodeURIComponent(course.id)}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/admin/courses/edit?courseId=${encodeURIComponent(course.id)}`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>

                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(course)}>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1}-
                        {Math.min(currentPage * itemsPerPage, filteredCourses.length)} out of {filteredCourses.length} results.
                    </p>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="10 per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="50">50 pee page</SelectItem>
                            <SelectItem value="100">100 per page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {getPageNumbers().map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <CourseDeletionDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} courseTitle={courseToDelete?.name || ''} action={handleCourseDeletion} />

            <Dialog open={massActionDialogOpen} onOpenChange={setMassActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mass actions</DialogTitle>
                        <DialogDescription>
                            Choose an action for the {selectedCourses.length} selected courses
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Button onClick={() => handleMassAction("delete")} variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete all selected courses
                        </Button>
                        <Button onClick={() => handleMassAction("available")} variant="outline">
                            Mark all selected courses as unavailable
                        </Button>
                        <Button onClick={() => handleMassAction("unavailable")} variant="outline">
                            Mark all selected courses as available
                        </Button>
                        <Button onClick={() => handleMassAction("export")} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export all selected courses
                        </Button>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setMassActionDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}