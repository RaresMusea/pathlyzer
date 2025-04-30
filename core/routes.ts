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

export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
export const LOGIN_PAGE: string = '/login';
export const UNAUTHORIZED_REDIRECT: string = '/unauthorized';