import { Heart, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

//TO BE REPLACED WITH REAL DATA

const userStats = {
    lives: 3,
    maxLives: 5,
    xp: 1250,
    nextLevelXp: 2000,
    level: 4,
}

export const UserProgress = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Your progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Lives */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <Heart className="mr-2 h-5 w-5 text-red-500" />
                            Lifes
                        </h3>
                        <span className="font-bold">
                            {userStats.lives}/{userStats.maxLives}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        {Array.from({ length: userStats.maxLives }).map((_, i) => (
                            <Heart
                                key={i}
                                className={`h-6 w-6 ${i < userStats.lives ? "text-red-500 fill-red-500" : "text-muted-foreground"}`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Regain life points by completing previous sections of a course</p>
                </div>

                {/* XP */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium flex items-center">
                            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                            Experience (XP)
                        </h3>
                        <span className="font-bold">
                            {userStats.xp}/{userStats.nextLevelXp}
                        </span>
                    </div>
                    <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-2" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
                            Level {userStats.level}
                        </div>
                        <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 text-yellow-500" />
                            Level {userStats.level + 1}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}