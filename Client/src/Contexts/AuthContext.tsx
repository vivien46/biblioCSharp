import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../Api/http';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    isAuthLoading: boolean;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    userRole: string;
    setUserRole: React.Dispatch<React.SetStateAction<string>>;
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    checkUserLoggedIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isUserLoggedIn: false,
    setIsUserLoggedIn: () => {},
    isAuthLoading: true,
    username: '',
    setUsername: () => {},
    userRole: '',
    setUserRole: () => {},
    userId: '',
    setUserId: () => {},
    checkUserLoggedIn: async () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');

    // L'identité vient du serveur (cookie HttpOnly), jamais d'un cookie modifiable par le navigateur
    const checkUserLoggedIn = useCallback(async () => {
        try {
            const response = await apiFetch(`${API_BASE_URL}/user/profile`);
            if (!response.ok) {
                throw new Error('Non connecté');
            }
            const data = await response.json();
            setIsUserLoggedIn(true);
            setUserId(data.id.toString());
            setUsername(data.username);
            setUserRole(Number(data.role) === 1 ? 'Admin' : 'User');
        } catch {
            setIsUserLoggedIn(false);
            setUserId('');
            setUsername('');
            setUserRole('');
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    return (
        <AuthContext.Provider value={{
            isUserLoggedIn, setIsUserLoggedIn,
            isAuthLoading,
            username, setUsername,
            userRole, setUserRole,
            userId, setUserId,
            checkUserLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
