import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Tab } from "@/types/types";
import { getIconForFile } from "vscode-icons-js";

interface EditorTabsContextType {
    tabs: Tab[] | undefined;
    currentTab: string | undefined;
    openTab: (tab: Tab) => void;
    closeTab: (tabId: string) => void;
    setTabs: (newTabs: Tab[] | undefined) => void;
    setActiveTab: (tabId: string) => void;
    getCurrentTabRef: () => Tab | undefined;
    updateTabContentAfterRenaming: (oldFilePath: string, newFilePath: string, newFileName: string) => Promise<string>;
    updateTabsContentAfterDeepRenaming: (oldPath: string, newPath: string) => void;
    updateTabContentAfterDeleting: (oldFilePath: string) => void;
}

const EditorTabsContext = createContext<EditorTabsContextType | undefined>(undefined);

export const EditorTabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [tabs, setTabs] = useState<Tab[]>();
    const [currentTab, setCurrentTab] = useState<string | undefined>();

    const openTab = useCallback((tab: Tab) => {
        setTabs((prevTabs) => {
            if (!prevTabs) return [tab];

            if (prevTabs.some((t) => tab.id === t.id)) return prevTabs;
            return [...prevTabs, tab];
        });
        setCurrentTab(tab.id);
    }, []);

    const updateTabContentAfterRenaming = async (oldFilePath: string, newFilePath: string, newFileName: string): Promise<string> => {
        const imageUrl = `https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/${(await getIconForFile(newFileName)) || ""}`;

        setTabs((prevTabs) => {
            if (!prevTabs) {
                return prevTabs
            };

            return prevTabs.map(tab =>
                tab.id === oldFilePath ? { ...tab, id: newFilePath, name: newFileName, imageUrl } : tab
            );
        });

        setCurrentTab((prevCurrentTab) => {
            if (!prevCurrentTab || prevCurrentTab !== oldFilePath) return prevCurrentTab;

            return newFilePath;
        });

        return imageUrl;
    };

    const updateTabsContentAfterDeepRenaming = useCallback((oldPath: string, newPath: string) => {
        setTabs((prevTabs: Tab[] | undefined) => {
            if (!prevTabs) return [];

            const updatedTabs = prevTabs.map((tab: Tab) => {
                if (tab.id.startsWith(oldPath)) {
                    return { ...tab, id: tab.id.replace(oldPath, newPath) };
                }
                return tab;
            });

            return updatedTabs;
        });
    }, []);

    const updateTabContentAfterDeleting = (oldFilePath: string): void => {
        setTabs((prevTabs) => {
            if (!prevTabs) return [];

            const newTabs = prevTabs.filter(t => !t.id.startsWith(oldFilePath));

            if (currentTab && currentTab.startsWith(oldFilePath)) {
                if (newTabs.length > 0) {
                    setCurrentTab(newTabs[0].id);
                } else {
                    setCurrentTab(undefined);
                }
            }

            return newTabs;
        });
    }

    const closeTab = useCallback((tabId: string) => {
        setTabs((prevTabs) => {
            const tabIndex: number | undefined = prevTabs?.findIndex((tab) => tab.id === tabId);
            const updatedTabs: Tab[] | undefined = prevTabs?.filter((tab) => tab.id !== tabId);

            if (currentTab === tabId) {
                const newIndex: number = (tabIndex !== undefined && tabIndex > 0) ? tabIndex - 1 : 0;
                setCurrentTab(updatedTabs && updatedTabs.length > 0 ? updatedTabs[newIndex]?.id : undefined);
            }

            return updatedTabs;
        });
    }, [currentTab]);

    const setActiveTab = useCallback((tabId: string) => {
        setCurrentTab(tabId);
    }, []);

    const getCurrentTabRef = () => {
        return tabs?.find(t => t.id === currentTab);
    }

    return (
        <EditorTabsContext.Provider value={{
            tabs,
            setTabs,
            currentTab,
            openTab,
            closeTab,
            setActiveTab,
            getCurrentTabRef,
            updateTabContentAfterRenaming,
            updateTabsContentAfterDeepRenaming,
            updateTabContentAfterDeleting
        }}>
            {children}
        </EditorTabsContext.Provider>
    )
}

export const useEditorTabs = () => {
    const context = useContext(EditorTabsContext);

    if (!context) {
        throw new Error("useEditorTabs() must be used within an EditorTabsProvider!");
    }

    return context;
};