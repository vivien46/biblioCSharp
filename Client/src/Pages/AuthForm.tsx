import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = Cookies.get('UserId');
        const usernameCookie = Cookies.get('Username');
        const userRoleCookie = Cookies.get('Role');

        if (userId && usernameCookie && userRoleCookie) {
            setIsUserLoggedIn(true);
            setUsername(usernameCookie);
            setRole(Number(userRoleCookie) === 0 ? 'Admin' : '');
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_BASE_URL}/User/login`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();

                Cookies.set('UserId', data.id.toString(), { path: '/' });
                Cookies.set('Username', data.username, { path: '/' });
                Cookies.set('Role', data.role.toString(), { path: '/' });

                setIsUserLoggedIn(true);
                setUsername(data.username);
                setRole(data.role === 1 ? 'Admin' : '');
                setMessage('Connexion réussie ! Vous serez redirigé...');
                setCountdown(5);
            } else {
                setMessage("Nom d'utilisateur ou mot de passe incorrect.");
            }
        } catch {
            setMessage("Impossible de se connecter pour le moment.");
        }
    };

    useEffect(() => {
        if (countdown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        if (countdown === 0) {
            navigate('/');
        }
    }, [countdown, navigate]);

    return (
        <div className="bg-gray-200 p-4">
            {isUserLoggedIn ? (
                <>
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Vous êtes déjà connecté avec l'utilisateur {username}
                    </h1>

                    {role && (
                        <h2 className="text-xl text-center">
                            Vous êtes connecté en tant que {role}
                        </h2>
                    )}

                    {role === 'Admin' && (
                        <button className="bg-green-500 text-white p-2 rounded mt-4">
                            Accéder au panneau d'administration
                        </button>
                    )}
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block">Nom d'utilisateur</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-gray-300 p-2 rounded"
                                placeholder="Nom d'utilisateur"
                                autoComplete="username"
                            />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block">Mot de passe</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 p-2 rounded"
                                placeholder="Mot de passe"
                                autoComplete="current-password"
                            />

                            <div className="absolute top-2/3 left-44 transform -translate-y-1/2 cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-sm mt-2"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <input
                                type="submit"
                                value="Se connecter"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            />
                        </div>

                        {message && <div className="text-red-500 mt-4">{message}</div>}
                    </form>
                </>
            )}
        </div>
    );
};

export default AuthForm;