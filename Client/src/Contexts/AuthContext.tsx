import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    userRole: string;
    setUserRole: React.Dispatch<React.SetStateAction<string>>;
    checkUserLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isUserLoggedIn: false,
    setIsUserLoggedIn: () => {},
    username: '',
    setUsername: () => {},
    userRole: '',
    setUserRole: () => {},
    checkUserLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        const userId = Cookies.get('UserId');
        const usernameCookie = Cookies.get('Username');
        const userRoleCookie = Cookies.get('Role') || '';
        if (userId && usernameCookie && userRoleCookie) {
            setIsUserLoggedIn(true);
            setUsername(usernameCookie);
            setUserRole(Number(userRoleCookie) === 1 ? 'Admin' : 'User');
        }
    };

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn, username, userRole, setUserRole, setUsername, checkUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};