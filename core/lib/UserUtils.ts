export const getUserInitials = (name: string | undefined): string => {
    if (!name) return 'UN';

    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
        return nameParts[0].charAt(0).toUpperCase();
    } else {
        return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
    }
};