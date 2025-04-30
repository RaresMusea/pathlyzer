import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "@/components/user/UserStats";
import { UserProgress } from "@/components/user/UserProgress";
import { CourseDto, EnrollmentRetrievalDto } from "@/types/types";
import { getAvailableCourses } from "@/app/service/course/courseService";
import { PageTransition } from "@/components/misc/animations/PageTransition";
import { CoursesWrapper } from "@/components/learning/courses/CoursesWrapper";
import { getUserEnrollments } from "@/app/service/course/enrollmentService";

export default async function CoursesPage() {
    const availableCourses: CourseDto[] = await getAvailableCourses();
    const userEnrollments: EnrollmentRetrievalDto[] = await getUserEnrollments();

    return (
        <PageTransition>
            <div className="p-6 w-full">
                <div className="flex flex-col md:flex-row gap-6">
                    <CoursesWrapper courses={availableCourses} userEnrollments={userEnrollments} />
                    <div className="md:relative md:w-80 w-full mt-14">
                        <div className="md:sticky md:top-6 space-y-6">
                            <UserProgress />
                            <UserStats />
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl">Daily challenge</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Solve a DSA quiz and earn bonus XP !
                                    </p>
                                    <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                                        Begin challenge
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
