import { UserRole } from "@prisma/client";
import { User } from "lucide-react";
import { Shield } from 'lucide-react';

export interface UserAppRole {
    roleName: string;
    icon: React.ElementType;
    description: string;
}

export const getUserInitials = (name: string | undefined): string => {
    if (!name) return 'UN';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    } else {
        return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    }
};

export const getUserAppRoles = (userRole: UserRole | undefined): UserAppRole[] => {
    const roleMap: Record<UserRole, UserAppRole[]> = {
        [UserRole.ADMINISTRATOR]: [
            {
                roleName: 'Standard User Mode',
                icon: User,
                description: 'Limited access to certain features and functionalities.',
            },
            {
                roleName: 'Administrator Mode',
                icon: Shield,
                description: 'Full control and access across all entities and features.',
            },
        ],
        [UserRole.USER]: [
            {
                roleName: 'Standard User Mode',
                icon: User,
                description: 'Limited access to certain features and functionalities.',
            },
        ],
    }

    return roleMap[userRole ?? UserRole.USER] ?? []
}

export const getXpThreshold = (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}