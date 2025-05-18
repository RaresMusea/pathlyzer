"use client";

import axios from "axios";
import { useEffect, useRef } from "react";

export const useLearningSession = (lessonId: string) => {
    const sessionIdRef = useRef<string | null>(null);
    const activeStartRef = useRef<number | null>(null);
    const pauseStartRef = useRef<number | null>(null);
    const hasSentEndRef = useRef<boolean>(false);
    const isInitializedRef = useRef<boolean>(false);

    const startSession = async () => {
        try {
            const response = await axios.post("/api/learning-session/start", { lessonId });
            if (response.status === 201) {
                sessionIdRef.current = response.data.sessionId;
                activeStartRef.current = Date.now();
            }
        } catch (error) {
            console.error("Failed to start session:", error);
        }
    };

    const endSession = async () => {
        if (!sessionIdRef.current || !activeStartRef.current || hasSentEndRef.current) return;
        hasSentEndRef.current = true;

        const now = Date.now();
        let activeDuration = 0;

        if (pauseStartRef.current) {
            const pausedTime = now - pauseStartRef.current;
            activeDuration = Math.floor((now - activeStartRef.current - pausedTime) / 1000);
        } else {
            activeDuration = Math.floor((now - activeStartRef.current) / 1000);
        }

        const duration = Math.max(1, activeDuration);

        try {
            await axios.post("/api/learning-session/end", {
                sessionId: sessionIdRef.current,
                duration
            });
        } catch (error) {
            navigator.sendBeacon(
                "/api/learning-session/end",
                JSON.stringify({
                    sessionId: sessionIdRef.current,
                    duration
                })
            );
        }
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {

            if (activeStartRef.current && !pauseStartRef.current) {
                pauseStartRef.current = Date.now();
            }
        } else if (pauseStartRef.current) {
            
            if (activeStartRef.current) {
                const pausedDuration = Date.now() - pauseStartRef.current;
                activeStartRef.current += pausedDuration;
            }
            pauseStartRef.current = null;
        }
    };

    useEffect(() => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        startSession();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", endSession);

        return () => {
            endSession();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", endSession);
        };
    }, [lessonId]);
};