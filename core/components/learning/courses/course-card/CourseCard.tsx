import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CourseDto } from "@/types/types";
import { CourseDifficulty } from "@prisma/client";
import { ChevronRight, ClipboardPaste, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export const CourseCard = ({ course }: { course: CourseDto }) => {
    return (
        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative w-full h-[250px]">
                <Image
                    src={course.imageSrc}
                    alt={course.name}
                    fill
                    className="object-cover w-full h-[250px] rounded-sm"
                />
                {0 > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/90 dark:bg-background/50 backdrop-blur-sm p-2">
                        <div className="flex items-center gap-2">
                            <Progress value={0} className="h-2" />
                            <span className="text-xs font-medium">{0}%</span>
                        </div>
                    </div>
                )}
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <Badge
                        variant={
                            course.difficulty === CourseDifficulty.BEGINNER
                                ? "default"
                                : course.difficulty === CourseDifficulty.INTERMEDIATE
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
                        <Badge key={tag.id} variant="outline" className="bg-muted/50">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    35h
                </div>

                <>
                    {
                        0 === 0 ?
                            <Button variant="link">
                                <Link href={`/courses/learn/${course.id}`}>
                                <div className="flex flex-row items-center">
                                    <div>Continue</div>
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </div>
                                </Link>
                            </Button>
                            :
                            <Button variant="default">
                                Enroll now
                                <ClipboardPaste className="ml-1 h-4 w-4" />
                            </Button>
                    }
                </>
            </CardFooter>
        </Card>
    )
}