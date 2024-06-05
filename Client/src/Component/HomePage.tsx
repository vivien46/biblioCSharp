import React from "react";

const HomePage: React.FunctionComponent = () => {
    // Add your code here to build the content of the home page

    return (
        <div>
            <h1 className='text-center font-medium text-2xl'>Bienvenue Sur BiblioCsharp</h1>

            <p className='text-center text-lg'>BiblioCsharp est une application web permettant de gérer une bibliothèque.</p>
            <p className='text-center text-lg'>Vous pouvez consulter la liste des livres, des auteurs et des emprunts.</p>
            <p className='text-center text-lg'>Vous pouvez également ajouter, modifier ou supprimer des livres, des auteurs et des emprunts.</p>

            <p className='text-center text-lg'>Pour commencer, veuillez cliquer sur
                <a href='/api/user/register' className='text-blue-500 hover:underline'> Sign Up</a>
            </p>
            {/* <p className='text-center text-lg'>Si vous avez déjà un compte, veuillez cliquer sur
                <a href='/api/user/login' className='text-blue-500 hover:underline'> Sign In</a>
            </p> */}
            
        </div>
    );
}

export default HomePage;