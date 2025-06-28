import { CourseDifficulty, CourseTag, QuestionType, QuizType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { LucideIcon } from "lucide-react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const PORT: number = 3001;
export const ENDPOINT_ROOT: string = `http://localhost:${PORT}`;
export const EXECUTION_ENGINE_URI: string = `ws://localhost:3001`;

// #region Animations related types

export enum AnimationDirection {
    FORWARDS,
    BACKWARDS,
    NONE
}

// #endregion

// #region UserStats-related types

export interface UserStatsDto {
    id: string;
    lives: number;
    xp: number;
    level: number;
}

export interface UserStatsMutationDto extends UserStatsDto {
    userId: string;
    completedExams?: number;
    completedQuizzes?: number;
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
    level: number;
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

export interface MultipleChoiceQuestionDto extends BaseQuestionDto {
    type: "MULTIPLE";
    choices: BaseChoiceDto[];
}

export interface CodeFillQuestionDto extends BaseQuestionDto {
    type: "CODE_FILL";
    codeSection: {
        code: string;
        language: string;
        correct: string[];
    };
}

export type QuestionMutationDto = SingleChoiceQuestionDto | MultipleChoiceQuestionDto | CodeFillQuestionDto;

export interface LessonContentDto {
    title: string;
    content: JsonValue;
}

export interface CodeSectionDto {
    id?: string;
    code: string;
    language?: string;
}

export interface AnswerChoiceDto {
    id?: string;
    questionId: string;
    text: string;
}

export interface ExaminationClientViewDto extends BaseQuestionDto {
    codeSection?: CodeSectionDto;
    answerChoices?: AnswerChoiceDto[];
}

export interface CodeFillEvaluationResult {
    questionId: string;
    isCorrect: boolean;
    correctIndices: number[];
};

export interface QuestionCheckDto {
    id: string;
    type: QuestionType;
    rewardXp: number;
    choices: {
        id: string;
        isCorrect: boolean;
    }[];
    codeSection: {
        correct: string[];
    };
};

export interface CheckResult {
    isCorrect: boolean;
    correctIndices?: number[];
    correctChoiceIds?: string[];
}

export interface CheckResponseDto {
    status: "correct" | "incorrect";
    result: CheckResult;
    xpReward?: number;
    penalty?: { newLives: number };
}

export interface QuestionCheckPayload {
    quizType: QuizType;
    questionId: string;
    answer: string[];
}

export interface ExaminationCompletionPayload {
    quizId: string;
    gainedXp: number;
    isLastLesson: boolean;
};

export interface ExaminationFinishedResponse {
    currentXp: number;
    currentLevel: number;
}

export interface BasicLessonDto {
    id: string;
    title: string;
    order: number;
    description: string;
}

export interface LessonPracticeDto {
    id: string;
    lessonId: string;
    items: LessonPracticeItemDto[];
}

export interface LessonPracticeItemDto {
    id: string;
    title: string;
    duration: number;
    content: string;
}

// #region User dashboard-related types

export interface UserLearningCompletionDto {
    completedCourses: number;
    completedLessons: number;
    completedUnits: number;
    completedEvaluations: number;
}

export interface WeeklyActivityEntry {
  day: string;
  sessions: number;
  duration: number;
  xpGained: number;
  lessonsCompleted: number;
}

export interface SkilsDistributionDto {
    name: string;
    value: number;
    color: string;
    percent: number;
}


// #endregion