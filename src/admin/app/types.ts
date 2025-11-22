export interface User {
    loginId?: string;
    userId: string;
    username: string;
}

export interface LoginResult {
    success: boolean;
    actionRequired?: string;
    error?: string;
}
