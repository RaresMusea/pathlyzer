"use client";

import { MainNavigationUnwrappedProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import { FolderClock, FolderCode, Gauge, GraduationCap, LayoutDashboard, Settings2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export enum AppMode {
    STANDARD_USER,
    ELEVATED,
}

const data: { standardNav: MainNavigationUnwrappedProps[], adminNav: MainNavigationUnwrappedProps[] } = {
    standardNav: [
        {
            title: "Dashboard",
            url: "/dashboard",
            isActive: true,
            icon: LayoutDashboard,
            items: [],
        },
        {
            title: "Recent Projects",
            icon: FolderClock,
            isActive: false,
            url: '#',
            items: [],
        },
        {
            title: 'All Projects',
            url: '/projects',
            icon: FolderCode,
            items: [],
        },
        {
            title: 'Courses',
            url: '/courses',
            icon: GraduationCap,
            items: [],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    adminNav: [
        {
            title: "Insights",
            url: "/admin/insights",
            isActive: true,
            icon: Gauge
        },
        {
            title: "Courses",
            url: "/admin/courses",
            isActive: false,
            icon: GraduationCap,
        }
    ]
};

const getAppMode = () => {
    const stored = localStorage.getItem("appMode");
    if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (parsed === AppMode.ELEVATED || parsed === AppMode.STANDARD_USER) {
            return {
                appMode: parsed,
                navData: parsed === AppMode.ELEVATED ? data.adminNav : data.standardNav,
            };
        }
    }
    return {
        appMode: AppMode.STANDARD_USER,
        navData: data.standardNav,
    };
};

interface UserAppRoleContextProps {
    currentAppMode: AppMode;
    navData: MainNavigationUnwrappedProps[];
    setAppMode: (newAppMode: AppMode) => void;
};

const UserAppRoleContext = createContext<UserAppRoleContextProps | undefined>(undefined);

export const UserAppRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const details = getAppMode();
    const { data: session, status } = useSession();
    const [isElevated, setIsElevated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            const role = session?.user?.role;
            setIsElevated(role === UserRole.ADMINISTRATOR);
        }
    }, [session, status]);

    const [currentAppMode, setCurrentAppMode] = useState<AppMode>(details.appMode);

    const [navData, setNavData] = useState<MainNavigationUnwrappedProps[]>(details.navData);

    const setAppMode = (newAppMode: AppMode) => {
        if (isElevated) {
            setCurrentAppMode(newAppMode);
            localStorage.setItem("appMode", newAppMode.toString());
            if (newAppMode === AppMode.ELEVATED) {
                setNavData(data.adminNav);
                router.push("/admin/insights");
            } else {
                setNavData(data.standardNav);
                router.push("/dashboard");
            }
        }
    };

    return (
        <UserAppRoleContext.Provider value={{
            currentAppMode,
            setAppMode,
            navData,
        }}>
            {children}
        </UserAppRoleContext.Provider>
    );
}

export const useAppRoleContext = () => {
    const context = useContext(UserAppRoleContext);

    if (!context) {
        throw new Error("useAppRoleContext() must be used within an UserAppContextProvider!");
    }

    return context;
};