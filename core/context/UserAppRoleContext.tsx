"use client";

import { MainNavigationUnwrappedProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import { FolderClock, FolderCode, Gauge, GraduationCap, LayoutDashboard, Settings2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export enum AppMode {
    STANDARD_USER,
    ELEVATED,
}

const navigationData = {
    standardNav: [
        { title: "Dashboard", url: "/dashboard", isActive: true, icon: LayoutDashboard, items: [] },
        { title: "Recent Projects", url: "#", isActive: false, icon: FolderClock, items: [] },
        { title: "All Projects", url: "/projects", icon: FolderCode, items: [] },
        { title: "Courses", url: "/courses", icon: GraduationCap, items: [] },
        {
            title: "Settings", url: "#", icon: Settings2, items: [
                { title: "General", url: "#" },
                { title: "Team", url: "#" },
                { title: "Billing", url: "#" },
                { title: "Limits", url: "#" },
            ]
        },
    ],
    adminNav: [
        { title: "Insights", url: "/admin/insights", isActive: true, icon: Gauge },
        { title: "Courses", url: "/admin/courses", isActive: false, icon: GraduationCap },
    ]
};

interface UserAppRoleContextProps {
    currentAppMode: AppMode;
    navData: MainNavigationUnwrappedProps[];
    setAppMode: (mode: AppMode) => void;
    setActiveItem: (item: MainNavigationUnwrappedProps) => void;
}

const UserAppRoleContext = createContext<UserAppRoleContextProps | undefined>(undefined);

export const UserAppRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const [isElevatedUser, setIsElevatedUser] = useState(false);
    const [currentAppMode, setCurrentAppMode] = useState<AppMode>(() => {
        const stored = localStorage.getItem("appMode");
        return stored ? (parseInt(stored, 10) as AppMode) : AppMode.STANDARD_USER;
    });
    const [navData, setNavData] = useState<MainNavigationUnwrappedProps[]>([]);

    useEffect(() => {
        if (status === "authenticated") {
            setIsElevatedUser(session.user?.role === UserRole.ADMINISTRATOR);
        }
    }, [session, status]);

    useEffect(() => {
        if (!pathname) return;

        const isAdminPath = pathname.startsWith("/admin");
        const expectedMode = isAdminPath ? AppMode.ELEVATED : AppMode.STANDARD_USER;

        if (expectedMode !== currentAppMode) {
            updateAppMode(expectedMode, false);
        } else {
            setNavData(isAdminPath ? navigationData.adminNav : navigationData.standardNav);
        }
    }, [pathname]);

    const updateAppMode = (newMode: AppMode, redirect: boolean = true) => {
        setCurrentAppMode(newMode);
        localStorage.setItem("appMode", newMode.toString());

        if (newMode === AppMode.ELEVATED) {
            setNavData(navigationData.adminNav);
            if (redirect) router.push("/admin/insights");
        } else {
            setNavData(navigationData.standardNav);
            if (redirect) router.push("/dashboard");
        }
    };

    const setAppMode = (mode: AppMode) => {
        if (!isElevatedUser) return;
        updateAppMode(mode);
    };

    const setActiveItem = (item: MainNavigationUnwrappedProps) => {
        const targetMode = item.url.startsWith("/admin") ? AppMode.ELEVATED : AppMode.STANDARD_USER;

        if (targetMode !== currentAppMode) {
            updateAppMode(targetMode, false);
        }
        router.push(item.url);
    };

    return (
        <UserAppRoleContext.Provider value={{ currentAppMode, navData, setAppMode, setActiveItem }}>
            {children}
        </UserAppRoleContext.Provider>
    );
};

export const useAppRoleContext = () => {
    const context = useContext(UserAppRoleContext);
    if (!context) {
        throw new Error("useAppRoleContext must be used inside UserAppRoleProvider.");
    }
    return context;
};