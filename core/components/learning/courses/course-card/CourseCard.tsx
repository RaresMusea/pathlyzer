import { CourseProps } from "@/app/(protected)/(appl)/courses/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";


export const CourseCard = ({course, key}: {course: CourseProps, key: number}) => {
    return (
        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-full h-[250px]">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover w-full h-[250px] rounded-sm"
                />
                {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 dark:bg-background/50 backdrop-blur-sm p-2">
                        <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-2" />
                            <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <Badge
                        variant={
                            course.difficulty === "Beginner"
                                ? "default"
                                : course.difficulty === "Intermediate"
                                    ? "secondary"
                                    : "destructive"
                        }
                    >
                        {course.difficulty}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-muted/50">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {course.duration}
                </div>
                <button className="text-sm font-medium flex items-center text-primary">
                    {course.progress > 0 ? "Continue" : "Enroll"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                </button>
            </CardFooter>
        </Card>
    )
}