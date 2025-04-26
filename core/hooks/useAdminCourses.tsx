"use client";

import { CourseDto } from "@/types/types";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";

export function useAdminCourses(initialCourses: CourseDto[]) {
    const router = useRouter();
    const tableRef = useRef<HTMLDivElement>(null)
    const [courses, setCourses] = useState<CourseDto[]>(initialCourses);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
    const [tagFilter, setTagFilter] = useState<string>('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [courseToDelete, setCourseToDelete] = useState<CourseDto | null>(null);
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">('asc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [loading, setLoading] = useState<boolean>(false);
    const [massActionDialogOpen, setMassActionDialogOpen] = useState<boolean>(false);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "image",
        "name",
        "difficulty",
        "tags",
        "available",
        "createdAt",
        "actions",
    ])
    const [viewMode, setViewMode] = useState<"table" | "grid">('table');
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState<boolean>(false);
    const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    });

    const allTags = Array.from(new Set(courses.flatMap((course) => course.tags.map((tag) => tag.id)))).map((tagId) => {
        const tag = courses.flatMap((course) => course.tags).find((tag) => tag.id === tagId)
        return tag || { id: tagId, name: `Tag ${tagId}` }
    });

    useEffect(() => {
        if (initialCourses.length > 0) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 300)
            return () => clearTimeout(timer);
        }
    }, [
        currentPage,
        itemsPerPage,
        searchTerm,
        difficultyFilter,
        availabilityFilter,
        tagFilter,
        sortColumn,
        sortDirection,
    ]);

    const scrollToTable = () => {
        if (tableRef.current) {
            const tableTop = tableRef.current.getBoundingClientRect().top + window.pageYOffset - 100;

            window.scrollTo({
                top: tableTop,
                behavior: "smooth",
            });
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedCourses([]);
        setSelectAll(false);

        scrollToTable();
    }

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number.parseInt(value));
        setCurrentPage(1);

        scrollToTable();
    }

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDifficulty = difficultyFilter === "all" || course.difficulty === difficultyFilter;

        const matchesAvailability =
            availabilityFilter === "all" ||
            (availabilityFilter === "available" && course.available) ||
            (availabilityFilter === "unavailable" && !course.available)

        const matchesTag = tagFilter === "all" || course.tags.some((tag) => tag.id === tagFilter);

        const matchesDateRange =
            (!dateRangeFilter.start || new Date(course.createdAt) >= new Date(dateRangeFilter.start)) &&
            (!dateRangeFilter.end || new Date(course.createdAt) <= new Date(dateRangeFilter.end));

        return matchesSearch && matchesDifficulty && matchesAvailability && matchesTag && matchesDateRange;
    });

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        let comparison = 0;

        switch (sortColumn) {
            case "name":
                comparison = a.name.localeCompare(b.name);
                break
            case "difficulty":
                comparison = a.difficulty.localeCompare(b.difficulty);
                break
            case "available":
                comparison = Number(a.available) - Number(b.available);
                break
            case "createdAt":
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break
            default:
                comparison = 0;
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    const paginatedCourses = sortedCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const halfMaxPages = Math.floor(maxPagesToShow / 2);

            let startPage = Math.max(1, currentPage - halfMaxPages);
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    const toggleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }

        scrollToTable();
    }

    const confirmDelete = (course: CourseDto) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    }

    const deleteCourse = () => {
        if (!courseToDelete) return;

        // @TODO: Implement delete logic
        console.warn(`Deleting course: ${courseToDelete.name}`);

        // Update local courses state after deletion succeeds
        setCourses(courses.filter((course) => course.id !== courseToDelete.id));

        setDeleteDialogOpen(false);
        setCourseToDelete(null);

        // Refresh data
    }

    const toggleAvailability = (course: Course) => {
        // @TODO: Implement toggle availability logic
        console.warn(`Updating availability for: ${course.name} to ${!course.available}`);

        // Update local courses state after toggling availability
        setCourses(courses.map((c) => (c.id === course.id ? { ...c, available: !c.available } : c)));

        // Refresh data
    }

    const handleCourseSelect = (courseId: string) => {
        setSelectedCourses((prev) => {
            if (prev.includes(courseId)) {
                return prev.filter((id) => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        })
    }

    const handleFullSelection = () => {
        if (selectAll) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(paginatedCourses.map((course) => course.id));
        }
        setSelectAll(!selectAll);
    }

    const handleMassAction = (action: string) => {
        console.log(`Acțiune în masă: ${action} pentru cursurile:`, selectedCourses)

        // @TODO: Implement mass action logic
        if (action === "delete") {
            setCourses(courses.filter((course) => !selectedCourses.includes(course.id)))
        } else if (action === "available") {
            setCourses(
                courses.map((course) => (selectedCourses.includes(course.id) ? { ...course, available: true } : course))
            );
        } else if (action === "unavailable") {
            setCourses(
                courses.map((course) => (selectedCourses.includes(course.id) ? { ...course, available: false } : course))
            );
        }

        setMassActionDialogOpen(false);
        setSelectedCourses([]);
        setSelectAll(false);
    }

    const toggleColumnVisibility = (column: string) => {
        setVisibleColumns((prev) => {
            if (prev.includes(column)) {
                return prev.filter((col) => col !== column);
            } else {
                return [...prev, column];
            }
        })
    }

    const handleExport = (format: string) => {
        //To be implemented
    }

    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
            setCurrentPage(1);
        }, 300),
        [],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    }

    const resetFilters = () => {
        setSearchTerm("");
        setDifficultyFilter("all");
        setAvailabilityFilter("all");
        setTagFilter("all");
        setDateRangeFilter({ start: "", end: "" });
        setCurrentPage(1);
        scrollToTable();
    };

    const applyFilters = () => {
        scrollToTable()
    }

    return {
        courses,
        currentPage,
        tagFilter,
        allTags,
        tableRef,
        loading,
        totalPages,
        itemsPerPage,
        paginatedCourses,
        selectedCourses,
        filteredCourses,
        courseToDelete,
        deleteDialogOpen,
        visibleColumns,
        viewMode,
        dateRangeFilter,
        difficultyFilter,
        availabilityFilter,
        massActionDialogOpen,
        selectAll,
        setDeleteDialogOpen,
        setDateRangeFilter,
        setMassActionDialogOpen,
        setDifficultyFilter,
        setSelectedCourses,
        setSelectAll,
        setViewMode,
        setTagFilter,
        setVisibleColumns,
        setAvailabilityFilter,
        handlePageChange,
        handleItemsPerPageChange,
        getPageNumbers,
        toggleSort,
        confirmDelete,
        deleteCourse,
        toggleAvailability,
        handleCourseSelect,
        handleFullSelection,
        handleMassAction,
        toggleColumnVisibility,
        handleExport,
        handleSearchChange,
        resetFilters,
        applyFilters,
    };
}