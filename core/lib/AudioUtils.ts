export const playSound = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play().catch((error) => console.error("Error playing sound:", error));
}