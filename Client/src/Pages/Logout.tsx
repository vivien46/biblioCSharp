import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import Cookies from 'js-cookie';

const Logout: React.FC = () => {
    const { setIsUserLoggedIn } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://localhost:7153/api/user/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // Supprimez les cookies
                Cookies.remove('UserId', { path: '/' });
                Cookies.remove('Username', { path: '/' });
                Cookies.remove('UserRole', { path: '/' });
                setIsUserLoggedIn(false);

                // Redirigez l'utilisateur vers l'index après la déconnexion
                navigate('/');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('An error occurred while logging out', error);
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
