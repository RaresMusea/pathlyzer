"use client";

import type { ReactNode } from "react"
import { motion } from "framer-motion"

function CoursesLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {children}
            </motion.div>
        </>
    )
}

export default CoursesLayout;
