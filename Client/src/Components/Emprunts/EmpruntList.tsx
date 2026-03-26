import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEmprunt } from '../../Api/emprunts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Emprunt {
  id: number;
  dateEmprunt: string;
  dateRetour: string;
  livreId: number;
  userId: number;
  livre?: {
    titre: string;
    imageUrl: string;
  };
  user?: {
    username: string;
  };
}

const EmpruntList: React.FC = () => {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchEmprunts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Emprunt`);
      if (!response.ok) {
        setError("Impossible de charger les emprunts.");
        return;
      }

      const data = await response.json();

      if (data.$values && Array.isArray(data.$values)) {
        const transformedData = data.$values.map((emprunt: Emprunt) => ({
          id: emprunt.id,
          dateEmprunt: emprunt.dateEmprunt,
          dateRetour: emprunt.dateRetour,
          livreId: emprunt.livreId,
          userId: emprunt.userId,
          livre: emprunt.livre
            ? {
                titre: emprunt.livre.titre,
                imageUrl: emprunt.livre.imageUrl || '',
              }
            : undefined,
          user: emprunt.user
            ? {
                username: emprunt.user.username,
              }
            : undefined,
        }));

        setEmprunts(transformedData);
      } else {
        setError("Format de données invalide.");
      }
    } catch {
      setError("Erreur lors de la récupération des données.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet emprunt ?");
    if (!confirmDelete) return;

    try {
      await deleteEmprunt(id);
      setEmprunts(emprunts.filter((emprunt) => emprunt.id !== id));
      alert("Emprunt supprimé avec succès");
    } catch {
      alert("Erreur lors de la suppression de l'emprunt");
    }
  };

  useEffect(() => {
    fetchEmprunts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">Liste des emprunts</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full border border-gray-300 xs:max-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Date d'emprunt</th>
              <th className="py-2 px-4 border-b">Date de retour</th>
              <th className="py-2 px-4 border-b">Livre</th>
              <th className="py-2 px-4 border-b">Emprunteur</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => {
              const dateEmprunt = new Date(emprunt.dateEmprunt).toLocaleDateString();
              const dateRetour = new Date(emprunt.dateRetour).toLocaleDateString();

              return (
                <tr key={emprunt.id} className="border-b">
                  <td className="py-2 px-4 text-center">{dateEmprunt}</td>
                  <td className="py-2 px-4 text-center">{dateRetour}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex flex-col items-center">
                      {emprunt.livre ? (
                        <>
                          {emprunt.livre.imageUrl && emprunt.livre.imageUrl.startsWith("http") ? (
                            <img
                              src={emprunt.livre.imageUrl}
                              alt={emprunt.livre.titre}
                              className="h-40 w-30 mt-3 mb-5"
                            />
                          ) : (
                            <p className="text-sm text-gray-500">Pas d'image</p>
                          )}
                          <span className="font-bold mb-1">{emprunt.livre.titre}</span>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Pas de livre associé</p>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-center font-bold">
                    {emprunt.user ? emprunt.user.username : 'Utilisateur inconnu'}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => navigate(`/api/emprunt/${emprunt.id}`)}
                      className="bg-blue-500 text-white hover:underline mr-4 py-1 px-2 rounded"
                    >
                      Voir
                    </button>

                    <button
                      onClick={() => navigate(`/api/emprunt/edit/${emprunt.id}`)}
                      className="bg-green-500 text-white hover:underline m-4 py-1 px-2 rounded"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(emprunt.id)}
                      className="bg-red-500 text-white hover:underline m-4 py-1 px-2 rounded"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmpruntList;