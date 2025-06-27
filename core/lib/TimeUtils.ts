export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const formatSecondsToTimeReadable = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
};

export const getCurrentWeekRange = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (d: Date) =>
        d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return `${format(start)} – ${format(end)}`;
};

export const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];