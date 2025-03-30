"use client";
import Image from "next/image";
import type React from "react"
import { X } from "lucide-react"
import { useEditorTabs } from "@/context/EditorTabsContext"

export const EditorTabs: React.FC = () => {
    const { tabs, closeTab, currentTab, setActiveTab } = useEditorTabs();

    return (
        <div className="flex overflow-x-auto">
            {tabs?.map((tab) => (
                <div
                    key={tab.id}
                    className={`flex items-center text-white tabBorder px-4 py-2 border-b-8 cursor-pointer border-r-4 border-transparent shadow-deep-right ${currentTab === tab.id ? "bg-[#00084D] tabBorderSelected hover:bg-[#001C80] font-semibold" : "bg-[#1e1e1e] tabBorderUnselected hover:bg-[#2e2e2e]"
                        }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="mr-2">
                        <Image width={20} height={20} src={tab.imageUrl} alt="Tab ref image"/>
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