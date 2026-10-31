import { apiFetch } from '../Api/http';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Logout: React.FC = () => {
    const { checkUserLoggedIn } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await apiFetch(`${API_BASE_URL}/User/logout`, {
                method: 'POST',
            });

            if (response.ok) {
                // Le serveur a supprimé le cookie d'authentification ; on met à jour l'état local
                await checkUserLoggedIn();

                // Redirigez l'utilisateur vers l'index après la déconnexion
                navigate('/');
            } else {
                console.error('Failed to logout');
                setShowModal(false);
                setErrorMessage("La déconnexion a échoué. Réessayez.");
            }
        } catch (error) {
            console.error('An error occurred while logging out', error);
            setShowModal(false);
            setErrorMessage("Impossible de vous déconnecter pour le moment.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutConfirmation = () => {
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <div className="max-w-md mx-auto my-8 bg-white shadow-md rounded p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Déconnexion</h1>

            {loading ? (
                <p className="text-gray-600">Déconnexion en cours...</p>
            ) : (
                <button
                    onClick={handleLogoutConfirmation}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Se déconnecter
                </button>
            )}

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white shadow-lg rounded p-6 max-w-sm w-full mx-4 text-center">
                        <p className="mb-6 text-gray-800">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Oui
                            </button>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logout;
