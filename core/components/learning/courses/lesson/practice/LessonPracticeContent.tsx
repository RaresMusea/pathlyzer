"use client";

import { Progress } from "@/components/ui/progress";
import { LessonPracticeItemDto } from "@/types/types";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle } from "lucide-react";

export const LessonPracticeContent = ({ practiceItems, totalDuration, elapsedTime, currentSectionIdx }: { practiceItems: LessonPracticeItemDto[]; totalDuration: number; elapsedTime: number; currentSectionIdx: number; }) => {
  const overallProgress = (elapsedTime / totalDuration) * 100;
  
  let timeBeforeCurrent = 0;
  
  for (let i = 0; i < currentSectionIdx; i++) {
    timeBeforeCurrent += practiceItems[i].duration;
  }

  const sectionElapsedTime = elapsedTime - timeBeforeCurrent;
  const currentDuration = practiceItems[currentSectionIdx]?.duration || 1;
  const currentSectionProgress = Math.min((sectionElapsedTime / currentDuration) * 100, 100);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 mb-4" />

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            {practiceItems.map((_, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < currentSectionIdx
                    ? "text-green-600"
                    : index === currentSectionIdx
                    ? "text-blue-600"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {index < currentSectionIdx ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      index === currentSectionIdx
                        ? "border-blue-600 bg-blue-100 dark:bg-blue-900"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  />
                )}
                <span className="ml-1">Section {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={currentSectionIdx}
          className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50 dark:border-white/10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {practiceItems[currentSectionIdx]?.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Section {currentSectionIdx + 1} of {practiceItems.length}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Section Progress</span>
              <span>{Math.round(currentSectionProgress)}%</span>
            </div>
            <Progress value={currentSectionProgress} className="h-2" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
              {practiceItems[currentSectionIdx]?.content}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};
