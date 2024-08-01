import React, { useEffect, useState } from 'react';
import { getUserById } from '../../Api/users';
import { getBookById } from '../../Api/books';

interface Emprunt {
  id: number;
  dateEmprunt: string;
  dateRetour: string;
  livreId: number;
  userId: number;
}

const EmpruntList: React.FC = () => {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
  const [error, setError] = useState<string | null>(null);

  const transformData = (data: any) => {
    // Extrait les valeurs du premier niveau du JSON
    if (data.$values) {
      return data.$values.map((emprunt: any) => ({
        id: emprunt.id,
        dateEmprunt: emprunt.dateEmprunt,
        dateRetour: emprunt.dateRetour,
        livreId: emprunt.livreId,
        userId: emprunt.userId,
      }));
    }
    return [];
  };

  useEffect(() => {
    const fetchEmprunts = async () => {
      try {
        const response = await fetch('https://localhost:7153/api/emprunt');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Données brutes reçues de l'API :", data); // Vérifiez que c'est bien un tableau

        const transformedData = transformData(data);

        if (Array.isArray(transformedData)) {
          const detailedEmprunts = await Promise.all(
            transformedData.map(async (emprunt: Emprunt) => {
              const user = await getUserById(emprunt.userId);
              const livre = await getBookById(emprunt.livreId);
              return {
                ...emprunt,
                userId: user.username, // Assurez-vous que user.username existe
                livreId: livre.titre, // Assurez-vous que livre.titre existe
              };
            })
          );
          setEmprunts(detailedEmprunts);
        } else {
          console.error("Les données transformées ne sont pas un tableau.");
          setError("Les données transformées ne sont pas un tableau.");
        }
      } catch (error: any) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchEmprunts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des emprunts</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Id</th>
              <th className="py-2 px-4 border-b">Date d'emprunt</th>
              <th className="py-2 px-4 border-b">Date de retour</th>
              <th className="py-2 px-4 border-b">Livre</th>
              <th className="py-2 px-4 border-b">Utilisateur</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => {
              const dateEmprunt = new Date(emprunt.dateEmprunt).toLocaleDateString();
              const dateRetour = new Date(emprunt.dateRetour).toLocaleDateString();
              return (
                <tr key={emprunt.id} className="border-b">
                  <td className="py-2 px-4 text-center">{emprunt.id}</td>
                  <td className="py-2 px-4 text-center">{dateEmprunt}</td>
                  <td className="py-2 px-4 text-center">{dateRetour}</td>
                  <td className="py-2 px-4 text-center">{emprunt.livreId}</td>
                  <td className="py-2 px-4 text-center">{emprunt.userId}</td>
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