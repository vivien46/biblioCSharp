// src/Components/Emprunts/EmpruntList.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

interface Emprunt {
    id: number;
    dateEmprunt: string;
    dateRetour: string;
    livre: {
        id: number;
        titre: string;
    };
    user:{
        id: number;
        username: string;
    }
  }

const EmpruntList: React.FC = () => {
  const [emprunts, setEmprunts] = useState<Emprunt[]>([]);

  useEffect(() => {
    const fetchEmprunts = async () => {
      try {
        const response = await fetch('https://localhost:7153/api/emprunt');
        const data = await response.json();
        setEmprunts(data);
      } catch (error) {
        console.error('Erreur de récupération des emprunts', error);
      }
    };

    fetchEmprunts();
  }, []);

return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Liste des Emprunts</h2>
      <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Date d'emprunt</th>
            <th className="p-2 text-left">Date de retour</th>
            <th className="p-2 text-left">Nom de l'utilisateur</th>
            <th className="p-2 text-left">Titre du livre</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emprunts.map(emprunt => (
            <tr key={emprunt.id} className="border-b">
              <td className="p-2">{emprunt.id}</td>
              <td className="p-2">{emprunt.dateEmprunt}</td>
              <td className="p-2">{emprunt.dateRetour}</td>
              <td className="p-2">{emprunt.user.username}</td>
              <td className="p-2">{emprunt.livre.titre}</td>
              <td className="p-2">
                <Link 
                  to={`/api/emprunt/edit/${emprunt.id}`} 
                  className="text-blue-500 hover:underline"
                >
                  <FaEdit className="inline-block" aria-label="Modifier" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpruntList;
