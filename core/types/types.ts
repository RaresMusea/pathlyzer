import { CourseDifficulty, CourseTag, QuestionType } from "@prisma/client";
import { LucideIcon } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { StringLiteralUnion } from "shiki";

const PORT: number = 3001;
export const ENDPOINT_ROOT: string = `http://localhost:${PORT}`;
export const EXECUTION_ENGINE_URI: string = `ws://localhost:3001`;

// #region UserStats-related types

export type UserStatsDto = {
    id: string;
    lives: number;
    xp: number;
    level: number;
}

// #endregion

// #region Project-related types

export type Project = {
    name: string;
    path: string
    lastModified: string
};

export type ProjectDetails = {
    id: string;
    description?: string;
    template: string;
    framework?: string;
    visibility: string
    path: string;
};

export type ProjectData = Project & ProjectDetails;

export type ProjectCreationPayload = {
    projectName: string,
    description?: string | null,
    template: string,
    framework?: string | null,
    visibility: string
}

// #endregion


// #region File-Manager-related types

export enum Type {
    FILE,
    DIRECTORY,
    DUMMY
}

interface CommonProps {
    id: string;
    type: Type;
    name: string;
    content?: string;
    path: string;
    parentId: string | undefined;
    depth: number;
}

export interface IFile extends CommonProps {
    iconUrl?: string | undefined;
}

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

export interface Directory extends CommonProps {
    files: IFile[];
    dirs: Directory[];
}

// #endregion

// #region Code Editor-related types

export interface FileCreationResult {
    name: string;
    parentDir: string;
    path: string;
}

export interface Tab {
    id: string;
    name: string;
    imageUrl: string | StaticImport;
}

// #endregion

export type ProjectCreationDto = {
    projectData: ProjectCreationPayload;
    projectId: string;
    projectPath: string;
    ownerId: string;
}


// #region Navigation-related types

export type MainNavigationProps = {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string,
            icons?: string[]
        }[]
    }[]
};

export type MainNavigationUnwrappedProps = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string,
        icons?: string[]
    }[]
}

export interface NavProjects {
    title: string;
    url: string;
    icons?: string[];
}

// #endregion


// #region Course-related types

export type CourseDto = {
    id: string;
    name: string;
    imageSrc: string;
    description: string;
    difficulty: CourseDifficulty;
    available: boolean;
    createdAt: string;
    updatedAt: string;
    tags: {
        id: string;
        name: string;
    }[];
}

export type CourseMutationDto = {
    name: string
    description: string
    difficulty: CourseDifficulty
    available: boolean
    image: string
    tags: CourseTag[]
}

export type EnrollmentRetrievalDto = {
    courseId: string;
    progress: number;
    lastAccessedLessonId: string;
}

export interface CourseUnitDto {
    id: string;
    name: string;
    description: string;
    order: number;
    lessons: LessonDto[];
}

export interface UserCourseUnitDto {
    id: string;
    name: string;
    description: string;
    order: number;
    lessons: LearningLessonItem[];
}

export interface LessonDto {
    id: string;
    title: string;
    description: string;
    order: number;
}

export interface LearningLessonItem {
    lessonInfo: LessonDto
    learningProgress: number
    isCurrent: boolean;
    isCompleted: boolean;
    isAccessible: boolean;
}

export interface LearningPathItem {
    unit: UserCourseUnitDto;
    isCurrent: boolean;
    isCompleted: boolean;
    progress?: {
        completedLessons: number;
        totalLessons: number;
    };
}

export interface SummarizedUserStats {
    lives: number;
    xp: number;
}

export interface UnitRearrangementDto {
    id: string;
    title: string;
    order: number;
}

export interface UnitMutationDto {
    id?: string;
    name: string;
    description: string;
}

export interface BaseQuestionDto {
    id?: string;
    type: QuestionType;
    order: number;
    prompt: string;
    rewardXp: number;
}

export interface BaseChoiceDto {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface SingleChoiceQuestionDto extends BaseQuestionDto {
    type: "SINGLE";
    choices: BaseChoiceDto[];
}

interface MultipleChoiceQuestionDto extends BaseQuestionDto {
    type: "MULTIPLE";
    choices: BaseChoiceDto[];
}

interface CodeFillQuestionDto extends BaseQuestionDto {
    type: "CODE_FILL";
    codeSections: {
        code: string;
        language?: string;
        correct: string[];
    }[];
}

export type QuestionMutationDto = SingleChoiceQuestionDto | MultipleChoiceQuestionDto | CodeFillQuestionDto;

// #endregion