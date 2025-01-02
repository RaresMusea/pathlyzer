import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CycleTextProps = {
    wordsList: string[];
    transitionTimeoutMs: number;
}

export default function CycleText({ wordsList, transitionTimeoutMs }: CycleTextProps) {
    const [index, setIndex] = useState(0);
    const [index2, setIndex2] = useState(0);

    const functions: string[] = ['console.log("', 'printf("', 'Console.WriteLine("', 'echo "', 'System.out.println("', 'std::cout << "'];
    const colors: string[] = ['text-blue-700', 'text-green-700', 'text-yellow-700', 'text-red-700', 'text-purple-700', 'text-pink-700'];

    const total = wordsList.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((current) => (current + 1) % total);
        }, transitionTimeoutMs);

        const secondInterval = setInterval(() => {
            setIndex2((current) => (current + 1) % functions.length);
        }, transitionTimeoutMs + 600);

        return () =>  {
            clearInterval(interval);
            clearInterval(secondInterval);
        };
    }, [total]);

    return (
        <div className="p-2 font-mono flex items-center justify-center gap-x-5">
            <div className="xl:text-5xl lg:text-3xl md:text-xl sm:text-base">1|</div>
            <span className="font-mono flex items-center justify-center text-center text-[#1D63ED] dark:text-[#E5F2FC] xl:text-5xl lg:text-3xl md:text-xl sm:text-base">
                <AnimatePresence mode="popLayout">
                    <motion.h1
                        key={`functions_${index2}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.08 }}
                        className="inline-block xl:text-5xl lg:text-3xl md:text-xl sm:text-base font-mono text-[#1D63ED] dark:text-[#E5F2FC]"
                    >
                        {functions[index2]}
                    </motion.h1>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={`words_${index}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.08 }}
                        className="inline-block font-mono xl:text-5xl lg:text-3xl md:text-xl sm:text-base text-[#c28560]"
                    >
                        {wordsList[index]}
                    </motion.h1>
                </AnimatePresence>
                {functions[index2].includes("(") ? `");` : `";`}
            </span>
        </div>
    );
}
