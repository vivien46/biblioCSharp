import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../../Api/books';
import { usersApi } from '../../Api/users';
import { useNavigate } from 'react-router-dom';

const EmpruntAddForm: React.FC = () => {
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

  

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const livresData = await getAllBooks();
        setLivres(livresData);
      } catch (error) {
        setError('Erreur lors de la récupération des livres');
      }
    };

    const fetchUsers = async () => {
      try {
        const userData = await usersApi();
        setUsers(userData);
      } catch (error) {
        setError('Erreur lors de la récupération des utilisateurs');
      }
    };

    fetchLivres();
    fetchUsers();
  }, []);

  const formatDateToDDMMYYYY = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');  // Formate le jour
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Formate le mois (0-indexé)
    const year = date.getFullYear();  // Année complète
    return `${day}/${month}/${year}`;  // Retourne au format dd/MM/yyyy
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (livreId === null || userId === null) {
      setError('Veuillez sélectionner un livre et un utilisateur');
      return;
    }

    const dateEmpruntFormatted = formatDateToDDMMYYYY(dateEmprunt);
    const dateRetourFormatted = formatDateToDDMMYYYY(dateRetour);

    const formData = new FormData();
    formData.append('DateEmprunt', dateEmpruntFormatted);
    formData.append('DateRetour', dateRetourFormatted);
    formData.append('LivreId', livreId.toString());
    formData.append('UserId', userId.toString());

    // Ajoute un log pour voir le contenu du FormData
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
  }

    try {
      const response = await fetch('https://localhost:7153/api/emprunt/add', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Extraire le texte de la réponse pour afficher l'erreur exacte renvoyée par le serveur
        const errorResponse = await response.text();
        console.error('Erreur détaillée du serveur:', errorResponse);
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

  const handleLivreChange = (titre: string) => {
    setLivreTitre(titre);
    const selectedLivre = livres.find((livre) => livre.titre === titre);
    if (selectedLivre) {
      setLivreId(selectedLivre.id);
    } else {
      setLivreId(null);
    }
  };

  const handleUserChange = (username: string) => {
    setUsername(username);
    const selectedUser = users.find((user) => user.username === username);
    if (selectedUser) {
      setUserId(selectedUser.id);
    } else {
      setUserId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Emprunt</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="dateEmprunt" className="block text-sm font-medium text-gray-700">
            Date d'emprunt
          </label>
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
          <label htmlFor="dateRetour" className="block text-sm font-medium text-gray-700">
            Date de retour
          </label>
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
          <label htmlFor="livreTitre" className="block text-sm font-medium text-gray-700">
            Titre du Livre
          </label>
          <select
            id="livreTitre"
            value={livreTitre}
            onChange={(e) => handleLivreChange(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option>Select a livre</option>
            {livres.map((livre) => (
              <option key={livre.id} value={livre.titre}>
                {livre.titre}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'Utilisateur
          </label>
          <select
            id="username"
            value={username}
            onChange={(e) => handleUserChange(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option>Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <input type="hidden" id="livreId" name="livreId" value={livreId ?? ''} />
        <input type="hidden" id="userId" name="userId" value={userId ?? ''} />
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

export default EmpruntAddForm;