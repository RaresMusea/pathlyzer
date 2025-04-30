import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import reactLogo from "@/resources/demo/react.png";
import { StaticImageData } from "next/image";
import { CourseCard } from "@/components/learning/courses/course-card/CourseCard";
import { UserStats } from "@/components/user/UserStats";
import { UserProgress } from "@/components/user/UserProgress";
import { CourseDto } from "@/types/types";
import { getAvailableCourses } from "@/app/service/course/courseService";
import { PageTransition } from "@/components/misc/animations/PageTransition";

export type CourseProps = {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    progress: number;
    image: string | StaticImageData;
    tags: string[];
}

export default async function CoursesPage() {
    const availableCourses: CourseDto[] = await getAvailableCourses();
    return (
        <PageTransition>
            <div className="p-6 w-full">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Available courses</h1>
                            <div className="flex items-center gap-2">
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {availableCourses.map((course) => (
                                <div key={course.id}>
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    </div>

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
