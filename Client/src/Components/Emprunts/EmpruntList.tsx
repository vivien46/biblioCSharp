import React, { useEffect, useState } from 'react';

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

  const fetchEmprunts = async () => {
    try {
      const response = await fetch('https://localhost:7153/api/emprunt');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Données brutes reçues de l'API :", data);

      if (data.$values && Array.isArray(data.$values)) {
        const transformedData = data.$values.map((emprunt: Emprunt) => {
          if (!emprunt.livre) {
            console.warn(`Emprunt avec id ${emprunt.id} n'a pas de livre associé.`);
          }
          if (!emprunt.user) {
            console.warn(`Emprunt avec id ${emprunt.id} n'a pas d'utilisateur associé.`);
          }

          return {
            id: emprunt.id,
            dateEmprunt: emprunt.dateEmprunt,
            dateRetour: emprunt.dateRetour,
            livreId: emprunt.livreId,
            userId: emprunt.userId,
            livre: emprunt.livre ? {
              titre: emprunt.livre.titre,
              imageUrl: emprunt.livre.imageUrl || '', 
            } : undefined,
            user: emprunt.user ? {
              username: emprunt.user.username,
            } : undefined,
          };
        });

        setEmprunts(transformedData);
      } else {
        console.error("Les données transformées ne sont pas un tableau.");
        setError("Les données transformées ne sont pas un tableau.");
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des données :", error);
      setError("Erreur lors de la récupération des données.");
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
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Date d'emprunt</th>
              <th className="py-2 px-4 border-b">Date de retour</th>
              <th className="py-2 px-4 border-b">Livre</th>
              <th className="py-2 px-4 border-b">Emprunteur</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => {
              const dateEmprunt = new Date(emprunt.dateEmprunt).toLocaleString();
              const dateRetour = new Date(emprunt.dateRetour).getFullYear();

              return (
                <tr key={emprunt.id} className="border-b">
                  <td className="py-2 px-4 text-center">{dateEmprunt}</td>
                  <td className="py-2 px-4 text-center">{dateRetour}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex flex-col items-center">
                      {emprunt.livre ? (
                        <>
                          {emprunt.livre.imageUrl ? (
                            <img
                              src={`/assets/Images/Livres/${emprunt.livre.imageUrl}`}
                              alt={emprunt.livre.titre}
                              className="h-40 w-30 mb-5"
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