import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiFetch } from '../Api/http';
import { useAuth } from '../Contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthForm: React.FC = () => {
    const { isUserLoggedIn, username: loggedInUsername, userRole, checkUserLoggedIn } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [countdown, setCountdown] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage('');

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await apiFetch(`${API_BASE_URL}/User/login`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Le cookie d'authentification est posé par le serveur ; on relit l'identité depuis /profile
                await checkUserLoggedIn();
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
                        Vous êtes déjà connecté avec l'utilisateur {loggedInUsername}
                    </h1>

                    {userRole && (
                        <h2 className="text-xl text-center">
                            Vous êtes connecté en tant que {userRole}
                        </h2>
                    )}

                    {userRole === 'Admin' && (
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
