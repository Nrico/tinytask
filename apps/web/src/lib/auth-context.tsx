"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserPlan = 'free' | 'pro';

export interface User {
    id: string;
    name: string;
    email: string;
    plan: UserPlan;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, name: string) => Promise<void>;
    logout: () => void;
    upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate checking local storage for session
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('tinytask_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, name: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email,
            plan: 'free',
        };

        setUser(newUser);
        localStorage.setItem('tinytask_user', JSON.stringify(newUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tinytask_user');
    };

    const upgradeToPro = () => {
        if (user) {
            const updatedUser = { ...user, plan: 'pro' as UserPlan };
            setUser(updatedUser);
            localStorage.setItem('tinytask_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, upgradeToPro }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
