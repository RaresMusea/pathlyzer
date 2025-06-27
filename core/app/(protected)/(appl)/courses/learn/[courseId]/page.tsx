import { getCourseByIdUser } from "@/app/service/learning/course/courseService";
import { getLearningPath } from "@/app/service/learning/paths/learningPathService";
import { getUserStats } from "@/app/service/user/userStatsService";
import { Unit } from "@/components/learning/courses/unit/Unit";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { Progress } from "@/components/ui/progress";
import { SummarizedUserStatsWrapper } from "@/components/user/SummarizedUserStats";
import { GamificationProvider } from "@/context/GamificationContext";
import { getCurrentProgress } from "@/lib/CourseUtils";

export default async function CoursePathPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const learningPath = await getLearningPath(courseId);
    const course = await getCourseByIdUser(courseId);
    const courseProgress = getCurrentProgress(learningPath);
    const userStats = await getUserStats();

    if (!userStats) {
        throw new Error('User stats cannot be undefined at this point!');
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-4 space-y-8 sticky">
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h1 className="text-2xl font-semibold">{course?.name} - Learning Path</h1>
                        <GamificationProvider initialUserStats={userStats}>
                            <SummarizedUserStatsWrapper userStats={userStats} />
                        </GamificationProvider>
                    </div>
                    <div className="w-full md:w-1/2 mx-auto space-y-1">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress: {courseProgress.completedLessons}/{courseProgress.totalLessons}</span>
                            <span>{Math.round((courseProgress.completedLessons / courseProgress.totalLessons) * 100)}%</span>
                        </div>
                        <Progress
                            value={(courseProgress.completedLessons / courseProgress.totalLessons) * 100}
                            max={100}
                        />
                    </div>

                    {learningPath.map((item) => (
                        <div key={item.unit.id} className="mb-10">
                            <Unit item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
}