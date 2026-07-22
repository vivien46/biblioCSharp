import React, { useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    const { isUserLoggedIn, username, checkUserLoggedIn } = useAuth();

    useEffect(() => {
        checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    return (
        <div className="container mx-auto px-4 py-8">
            {isUserLoggedIn ? (
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Bienvenue, <span className="text-blue-500">{username}</span> !
                    </h2>
                    <p className="text-gray-600">
                        Accédez à vos options via le menu de navigation.
                    </p>
                </div>
            ) : (
                <div className="text-center mb-12">
                    <p className="text-xl text-gray-700 mb-4">
                        Connectez-vous pour profiter de toutes les fonctionnalités.
                    </p>
                    <Link
                        to="/api/user/register"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                    >
                        Inscription
                    </Link>
                    <span className="mx-4 text-gray-500">ou</span>
                    <Link
                        to="/api/user/login"
                        className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
                    >
                        Connexion
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HomePage;