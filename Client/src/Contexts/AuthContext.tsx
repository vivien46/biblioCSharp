import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    checkUserLoggedIn: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isUserLoggedIn: false,
    setIsUserLoggedIn: () => {},
    username: '',
    setUsername: () => {},
    checkUserLoggedIn: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = () => {
        const userId = Cookies.get('UserId');
        const usernameCookie = Cookies.get('Username');
        if (userId && usernameCookie) {
            setIsUserLoggedIn(true);
            setUsername(usernameCookie);
        }
    };

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn, username, setUsername, checkUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};