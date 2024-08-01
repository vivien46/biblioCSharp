import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddEmpruntForm: React.FC = () => {

    const [dateEmprunt, setDateEmprunt] = useState<string>('');
    const [dateRetour, setDateRetour] = useState<string>('');
    const [livreTitre, setLivreTitre] = useState<string>('');
    const [livreId, setLivreId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchLivreId = async (titre: string) => {
        try{
            const response = await fetch(`https://localhost:7153/api/book?titre=${encodeURIComponent(titre)}`);
            if (!response.ok) {
                throw new Error('Erreur de récupération de l\'ID du livre');
              }
              const data = await response.json();
              if (data.length === 0) {
                setError('Livre non trouvé');
                setLivreId(null);
              } else {
                setLivreId(data[0].id);
                setError(null);
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
              if (data.length === 0) {
                setError('Utilisateur non trouvé');
                setUserId(null);
              } else {
                setUserId(data[0].id);
                setError(null);
              }
            } catch (error) {
              console.error('Erreur lors de la recherche de l\'utilisateur', error);
              setError('Erreur lors de la recherche de l\'utilisateur');
            }
          };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emprunt = {
            dateEmprunt,
            dateRetour,
            livreId,
            userId
        };

        try {
            const response = await fetch('https://localhost:7153/api/emprunt/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emprunt)
            });

          if(!response.ok) {
            throw new Error('Erreur lors de la création de l\'emprunt');
          }
          setDateEmprunt('');
          setDateRetour('');
          setLivreTitre('');
          setLivreId(null);
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
            value={dateRetour}
            onChange={(e) => setDateRetour(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="livreTitle" className="block text-sm font-medium text-gray-700">Titre du Livre</label>
          <input
            type="text"
            id="livreTitle"
            value={livreTitre}
            onChange={(e) => {
              setLivreTitre(e.target.value);
              // Rechercher l'ID du livre lorsque le titre change
              fetchLivreId(e.target.value);
            }}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'Utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              // Rechercher l'ID de l'utilisateur lorsque le username change
              fetchUserId(e.target.value);
            }}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* Champs cachés pour l'ID du livre et l'ID de l'utilisateur */}
        <input type="hidden" id="livreId" value={livreId ?? ''} />
        <input type="hidden" id="userId" value={userId ?? ''} />
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