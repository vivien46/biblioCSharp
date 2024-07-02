import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate(); // Assurez-vous d'importer useNavigate de 'react-router-dom'

    const handleLogout = async () => {
        try {
            const response = await fetch('https://localhost:7153/api/user/logout', {
                method: 'POST',
            });

            if (response.ok) {
                // Supprimez les cookies
                document.cookie = 'UserId=; path=/;';
                document.cookie = 'Username=; path=/;';
                
                // Redirigez l'utilisateur vers la page de connexion
                navigate('/api/user/login');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('An error occurred while logging out', error);
        }
    };

    const handleConfirmation = () => {
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    return (
        <div>
            <button onClick={handleConfirmation}>Logout</button>
            {showConfirmation && (
                <div>
                    <p>Are you sure you want to logout?</p>
                    <button onClick={handleLogout}>Yes</button>
                    <button onClick={handleCancel}>No</button>
                </div>
            )}
        </div>
    );
};

export default Logout;