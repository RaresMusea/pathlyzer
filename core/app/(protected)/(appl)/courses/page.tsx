import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import reactLogo from "@/resources/demo/react.png";
import { StaticImageData } from "next/image";
import { CourseCard } from "@/components/learning/courses/course-card/CourseCard";
import { UserStats } from "@/components/user/UserStats";
import { UserProgress } from "@/components/user/UserProgress";

const courses = [
    {
        id: 1,
        title: "JavScript fundamentals",
        description: "Learn how to create interactive web applications using JavaScript.",
        difficulty: "Beginner",
        duration: "4 weeks",
        progress: 65,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["JavaScript", "Web", "Frontend"],
    },
    {
        id: 2,
        title: "React",
        description: "Learn the art of building modern reusable web components with React.",
        difficulty: "Intermediate",
        duration: "6 weeks",
        progress: 30,
        image: reactLogo,
        tags: ["React", "JavaScript", "UI"],
    },
    {
        id: 3,
        title: "Node.js & Express",
        description: "Develop robust fullstack apps using Node.js along with Express.",
        difficulty: "Intermediate",
        duration: "5 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Node.js", "Backend", "API"],
    },
    {
        id: 5,
        title: "DSA (Data Structures and Algorithms)",
        description: "Master the fundamentals of data structures and algorithms.",
        difficulty: "Advanced",
        duration: "8 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Algo", "Data structures", "Programming"],
    },
    {
        id: 6,
        title: "Node.js & Express",
        description: "Develop robust fullstack apps using Node.js along with Express.",
        difficulty: "Intermediate",
        duration: "5 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Node.js", "Backend", "API"],
    },
    {
        id: 7,
        title: "DSA (Data Structures and Algorithms)",
        description: "Master the fundamentals of data structures and algorithms.",
        difficulty: "Advanced",
        duration: "8 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Algo", "Data structures", "Programming"],
    },
    {
        id: 8,
        title: "Node.js & Express",
        description: "Develop robust fullstack apps using Node.js along with Express.",
        difficulty: "Intermediate",
        duration: "5 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Node.js", "Backend", "API"],
    },
    {
        id: 9,
        title: "DSA (Data Structures and Algorithms)",
        description: "Master the fundamentals of data structures and algorithms.",
        difficulty: "Advanced",
        duration: "8 weeks",
        progress: 0,
        image: "/placeholder.svg?height=200&width=350",
        tags: ["Algo", "Data structures", "Programming"],
    },
]

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

export default function CoursesPage() {
    return (
        <div className="p-6 w-full">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Available courses</h1>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
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

    )
}
