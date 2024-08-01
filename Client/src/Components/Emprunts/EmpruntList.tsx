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

    useEffect(() => {
        fetch("https://localhost:7153/api/emprunt")
            .then(res => res.json())
            .then(async (data) => {
                const detaileEmprunts = await Promise.all(data.map(async (emprunt: Emprunt) => {
                    const user = await getUserById(emprunt.userId);
                    const livre = await getBookById(emprunt.livreId);
                    return {
                        ...emprunt,
                        userId: user.username,
                        livreId: livre.titre
                    };
            })); 
                setEmprunts(detaileEmprunts);
            
            });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Liste des emprunts</h1>
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
                    { emprunts.map(emprunt => {
                        const dateEmprunt = new Date(emprunt.dateEmprunt).toLocaleDateString();
                        const dateRetour = new Date(emprunt.dateRetour).toLocaleDateString();
                        return (
                        <tr key={emprunt.id} className="border-b">
                            <td className="py-2 px-4 text-center">{emprunt.id}</td>
                            <td className="py-2 px-4  text-center">{dateEmprunt}</td>
                            <td className="py-2 px-4  text-center">{dateRetour}</td>
                            <td className="py-2 px-4  text-center">{emprunt.livreId}</td>
                            <td className="py-2 px-4  text-center">{emprunt.userId}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default EmpruntList;