import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    userRole: string;
    setUserRole: React.Dispatch<React.SetStateAction<string>>;
    userId: string;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
    checkUserLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isUserLoggedIn: false,
    setIsUserLoggedIn: () => {},
    username: '',
    setUsername: () => {},
    userRole: '',
    setUserRole: () => {},
    userId: '',
    setUserId: () => {},
    checkUserLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        const userIdCookie = Cookies.get('UserId');
        const usernameCookie = Cookies.get('Username');
        const userRoleCookie = Cookies.get('Role') || '';

        if (userIdCookie && usernameCookie && userRoleCookie) {
            setIsUserLoggedIn(true);
            setUserId(userIdCookie);
            setUsername(usernameCookie);
            setUserRole(Number(userRoleCookie) === 1 ? 'Admin' : 'User');
        } else {
            setIsUserLoggedIn(false);
            setUserId('');
            setUsername('');
            setUserRole('');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isUserLoggedIn, setIsUserLoggedIn, 
            username, setUsername, 
            userRole, setUserRole,
            userId, setUserId,
            checkUserLoggedIn 
        }}>
            {children}
        </AuthContext.Provider>
    );
};