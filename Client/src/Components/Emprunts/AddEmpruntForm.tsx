import React, { useEffect, useState } from 'react';
import { usersApi } from '../../Api/users';
import { useNavigate } from 'react-router-dom';

const AddEmpruntForm: React.FC = () => {

    const [dateEmprunt, setDateEmprunt] = useState<string>('');
    const [dateRetour, setDateRetour] = useState<string>('');
    const [livreTitre, setLivreTitre] = useState<string>('');
    const [livreId, setLivreId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string>('');
    const [livres, setLivres] = useState<{ id: number; titre: string }[]>([]);
    const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchLivres = async () => {
        try {
            const response = await fetch('https://localhost:7153/api/book');
            if (!response.ok) {
                throw new Error('Erreur de récupération des livres');
              }
              const data = await response.json();
              
              if (data && data.$values){
                setLivres(data.$values);
              } else {
                throw new Error('Format de réponses API inattendu');
              }
              
            } catch (error) {
              console.error('Erreur lors de la récupération des livres', error);
              setError('Erreur lors de la récupération des livres');
            }
          }
    
    const fetchUsers = async () => {
        try {
            const response = await fetch('https://localhost:7153/api/user');
            if (!response.ok) {
                throw new Error('Erreur de récupération des utilisateurs');
              }
              const data = await response.json();
              if (data && data.$values){
                setUsers(data.$values);
              } else {
                throw new Error('Format de réponses API inattendu');
              }
            } catch (error) {
              console.error('Erreur lors de la récupération des utilisateurs', error);
              setError('Erreur lors de la récupération des utilisateurs');
            }
          }

    const fetchLivreId = async (titre: string) => {
        try{
            const response = await fetch(`https://localhost:7153/api/book?titre=${encodeURIComponent(titre)}`);
            if (!response.ok) {
                throw new Error('Erreur de récupération de l\'ID du livre');
              }
              const data = await response.json();

              console.log(data);
              if (data && data.$values && Array.isArray(data.$values) && data.$values.length > 0) {
                setLivreId(data.$values.id);
                setLivres(data.$values);
              } else {
                setError('Livre non trouvé');
                setLivreId(null);
              }
            } catch (error) {
              console.error('Erreur lors de la recherche du livre', error);
              setError('Erreur lors de la recherche du livre');
            }
          };
    
    const fetchUserId = async (username: string) => {
        try {
            const response = await fetch(`https://localhost:7153/api/user?username=${encodeURIComponent(username)}`);
            if (!response.ok) {
                throw new Error('Erreur de récupération de l\'ID de l\'utilisateur');
              }
              const data = await response.json();
              if (data && data.$values && Array.isArray(data.$values) && data.$values.length > 0) {
                setUserId(data.$values.id);
              } else {
                setError('Utilisateur non trouvé');
                setUserId(null);
              }
            } catch (error) {
              console.error('Erreur lors de la recherche de l\'utilisateur', error);
              setError('Erreur lors de la recherche de l\'utilisateur');
            }
          };

          useEffect(() => {
            fetchLivres();
            fetchUsers();
          }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (livreId === null || userId === null) {
            setError('Veuillez sélectionner un livre et un utilisateur');
            return;
        }

        const dateEmpruntUTC = new Date(dateEmprunt).toISOString();
        const dateRetourUTC = new Date(dateRetour).toISOString();

        const formData = new FormData();
        formData.append('DateEmprunt', dateEmpruntUTC);
        formData.append('DateRetour', dateRetourUTC);
        formData.append('LivreTitre', livreTitre);
        formData.append('Username', username);
        
        try {
          const response = await fetch('https://localhost:7153/api/emprunt/add', {
            method: 'POST',
            body: formData,
          });
          console.log(response);

          if(!response.ok) {
            throw new Error('Erreur lors de la création de l\'emprunt');
          }
          setDateEmprunt('');
          setDateRetour('');
          setLivreTitre('');
          setLivreId(null);
          setUsers([]);
          setUsername('');
          setUserId(null);
         


          navigate('/api/emprunt');

            } catch (error) {
                console.error('Erreur lors de la création de l\'emprunt', error);
                setError('Erreur lors de la création de l\'emprunt');
            }
 };

 return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Emprunt</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="dateEmprunt" className="block text-sm font-medium text-gray-700">Date d'emprunt</label>
          <input
            type="date"
            id="dateEmprunt"
            name='DateEmprunt'
            value={dateEmprunt}
            onChange={(e) => setDateEmprunt(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateRetour" className="block text-sm font-medium text-gray-700">Date de retour</label>
          <input
            type="date"
            id="dateRetour"
            name='DateRetour'
            value={dateRetour}
            onChange={(e) => setDateRetour(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="livreTitre" className="block text-sm font-medium text-gray-700">Titre du Livre</label>
          <select
                        id="livreTitre"
                        name='LivreTitre'
                        value={livreTitre}
                        onChange={(e) => {
                            setLivreTitre(e.target.value);
                            // Rechercher l'ID du livre lorsque le titre change
                            fetchLivreId(e.target.value);
                        }}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select a livre</option>
                        {livres.map((livre) => (
                            <option key={livre.id} value={livre.titre}>
                                {livre.titre}
                            </option>
                        ))}
                    </select>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'Utilisateur</label>
          <select
                  id='username'
                  name='Username'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    // Rechercher l'ID de l'utilisateur lorsque le nom change
                    fetchUserId(e.target.value);
                }}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Select a user</option>
                {users.map((user) => (
                    <option key={user.id} value={user.username}>
                        {user.username}
                    </option>
                ))}
                
          </select>
        </div>
        {/* Champs cachés pour l'ID du livre et l'ID de l'utilisateur */}
        <input type="hidden" id="livreId" name="LivreId" value={livreId ?? ''} />
        <input type="hidden" id="userId" name="UserId" value={userId ?? ''} />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddEmpruntForm;