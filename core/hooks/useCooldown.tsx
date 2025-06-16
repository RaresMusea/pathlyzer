import { useEffect, useState } from "react";

export const useCooldown = (cooldown: number) => {
    const [isCooldownActive, setIsCooldownActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState(cooldown);

    const COOLDOWN_KEY = "cooldown_start_time";

    useEffect(() => {
        const saved = localStorage.getItem(COOLDOWN_KEY);
        if (saved) {
            const savedTime = parseInt(saved, 10);
            const elapsed = Math.floor((Date.now() - savedTime) / 1000);
            if (elapsed < cooldown) {
                setIsCooldownActive(true);
                setRemainingTime(cooldown - elapsed);
            } else {
                localStorage.removeItem(COOLDOWN_KEY);
            }
        }
    }, [cooldown]);

    useEffect(() => {
        if (!isCooldownActive) return;

        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsCooldownActive(false);
                    localStorage.removeItem(COOLDOWN_KEY);
                    return cooldown;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isCooldownActive, cooldown]);

    const startCooldown = () => {
        const now = Date.now();
        localStorage.setItem(COOLDOWN_KEY, now.toString());
        setIsCooldownActive(true);
        setRemainingTime(cooldown);
    };

    return { isCooldownActive, remainingTime, startCooldown };
};
