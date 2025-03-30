export const publicRoutes: string[] = [
    "/",
    "/email-verification"
];

export const authRoutes: string[] = [
    "/login",
    "/register",
    "/error",
    "/reset",
    "/change-password",
];

//never blocked
export const apiAuthPrefix: string = '/api/auth';

export const DEFAULT_LOGIN_REDIRECT: string = "/settings";