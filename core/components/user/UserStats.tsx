import { Clock, Code, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

// TO BE REPLACED WITH REAL DATA

export const UserStats = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                        <Code className="mr-2 h-4 w-4" />
                        Solved quizzes
                    </span>
                    <span className="font-bold">42</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Total learning time
                    </span>
                    <span className="font-bold">24h 30m</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center">
                        <Trophy className="mr-2 h-4 w-4" />
                        Quests won
                    </span>
                    <span className="font-bold">7</span>
                </div>
            </CardContent>
        </Card>
    )
}