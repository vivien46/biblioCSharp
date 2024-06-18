import React from 'react';
import { useParams } from 'react-router-dom';



const ChangePasswordPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div>
            <h1>Page de changement de Mot de passe</h1>
           <p>Pour changer de mot de passe</p>
           <p>Veuillez entrer votre adresse E-mail</p>

            <div>
           <form action="">
            <div className='flex flex-col'>
                <label htmlFor="email">Adresse E-mail</label>
                <input type="text" name="email" id="email" placeholder="Entrez votre adresse E-mail" />
            </div>
            <div>
                <input type="submit" value="Envoyer"></input>
            </div>
           </form>
        <button onClick={() => window.location.href = `/api/user/change-password/${id}`}>Changer le mot de passe</button>
        </div>
        </div>
    );
    };

export default ChangePasswordPage;