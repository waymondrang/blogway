"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoginResult, User } from "types";
import { AuthHelper } from "utility/AuthHelper";

// TOOD: implement auth configure

interface AuthContextType {
    user: User | null;

    login: (
        username: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;

    logout: () => Promise<void>;

    // TODO: handle weird login cases
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // upon load, check if user is logged in
    useEffect(() => {
        (async () => {
            try {
                const currentUser = await AuthHelper.getUser();
                setUser(currentUser);
            } catch (error) {
                setUser(null);
            }
        })();
    }, []);

    const login = async (
        username: string,
        password: string
    ): Promise<LoginResult> => {
        return AuthHelper.login(username, password);
    };

    const logout = async () => {
        await AuthHelper.logout();
        setUser(null);
    };

    const value = { user: user, login, logout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context == null) {
        throw new Error("useauth must be used within authprovider");
    }

    return context;
}
