"use client";
import Image from "next/image";
import type React from "react"
import { X } from "lucide-react"
import { useEditorTabs } from "@/context/EditorTabsContext"

export const EditorTabs: React.FC = () => {
    const { tabs, closeTab, currentTab, setActiveTab } = useEditorTabs();

    console.log("Current tab", currentTab);

    console.log(tabs);

    return (
        <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
                <div
                    key={tab.id}
                    className={`flex items-center text-black dark:text-white border-b-3 
                   ${currentTab === tab.id
                            ? 'bg-[#1D63ED] text-white font-bold border-b-3 border-r-2 border-[#00084D] dark:border-[#1D63ED] dark:bg-[#00084D]'
                            : 'bg-slate-100 dark:bg-[#17191E] border-b-3 border-slate-400 dark:border-[#2e2e2e]'}
                   px-4 py-2 cursor-pointer shadow-deep-right`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="mr-2">
                        <Image width={20} height={20} src={tab.imageUrl} alt="Tab ref image" />
                    </span>
                    <span className="mr-2">{tab.name}</span>
                    <button
                        className="tabClose rounded-full p-1 "
                        onClick={(e) => {
                            e.stopPropagation()
                            closeTab(tab.id)
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    )
}