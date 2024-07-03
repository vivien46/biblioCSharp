import React, { useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";

const HomePage: React.FC = () => {
   const {isUserLoggedIn, username, checkUserLoggedIn } = useAuth();

   useEffect(() => {
         checkUserLoggedIn();
    }, [checkUserLoggedIn]);

    return (
        <div>
            <h1 className='text-center font-medium text-2xl'>Bienvenue Sur BiblioCsharp</h1>

            <p className='text-center text-lg'>BiblioCsharp est une application web permettant de gérer une bibliothèque.</p>
            <p className='text-center text-lg'>Vous pouvez consulter la liste des livres, des auteurs et des emprunts.</p>
            <p className='text-center text-lg'>Vous pouvez également ajouter, modifier ou supprimer des livres, des auteurs et des emprunts.</p>

            {isUserLoggedIn ? (
                <p className='text-center text-lg'>Bienvenue {username} !</p>
            ) : (
                <div className='text-center'>
                    <p className='text-lg'>Pour commencer, veuillez cliquer sur <a href='/api/user/register' className='text-blue-500 hover:underline'>Register</a></p>
                    <p className='text-lg'>Si vous avez déjà un compte, veuillez cliquer sur <a href='/api/user/login' className='text-blue-500 hover:underline'>Log In</a></p>
                </div>
            )}
            
        </div>
    );
}

export default HomePage;