import axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useCooldown = (lives: number, setLives: (newState: number) => void) => {
    const [remainingCooldown, setRemainingCooldown] = useState<number>(0);
    const hasRan = useRef(false);

    useEffect(() => {
        if (hasRan.current || lives !== 0) return;
        hasRan.current = true;

        const getCooldown = async () => {
            try {
                const response = await axios.get(`/api/user-stats/cooldown`);
                if (response.status === 200) {
                    const data = response.data;
                    setRemainingCooldown(data.active ? data.remainingSeconds : 0);
                }
            } catch (err) {
                console.error("Failed to fetch cooldown:", err);
            }
        };

        getCooldown();
    }, [lives]);

    useEffect(() => {
        if (remainingCooldown === 0) return;

        const interval = setInterval(() => {
            setRemainingCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingCooldown]);

    useEffect(() => {
        if (remainingCooldown !== 0) return;

        const grantLife = async () => {
            try {
                const response = await axios.patch(`/api/user-stats/cooldown/grant-life`);
                if (response.status === 200) {
                    setLives(response.data.lives);
                }
            } catch (err) {
                console.error("Failed to grant life after cooldown:", err);
            }
        };

        grantLife();
    }, [remainingCooldown]);

    return {
        remainingCooldown
    }
};
