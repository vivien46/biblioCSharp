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
        <div>
            <h1>Déconnexion</h1>

            {loading ? (
                <p>Déconnexion en cours...</p>
            ) : (
                <div>
                <button onClick={handleLogoutConfirmation} className='btn bg-red-500'>Se déconnecter</button>
                </div>
            )}

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <button onClick={handleLogout}>Oui</button>
                        <button onClick={handleCancel}>Non</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Logout;
