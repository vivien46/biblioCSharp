import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dashboard, getDashboard } from '../Api/admin';

const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<Dashboard | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setData(await getDashboard());
            } catch {
                setError("Impossible de charger le tableau de bord.");
            }
        };

        fetchDashboard();
    }, []);

    if (error) {
        return <p className="text-center text-red-500 mt-8">{error}</p>;
    }

    if (!data) {
        return <p className="text-center mt-8">Chargement...</p>;
    }

    const cartes = [
        { valeur: data.totalUsers, libelle: 'Utilisateurs' },
        { valeur: data.totalBooks, libelle: 'Livres' },
        { valeur: data.totalAuteurs, libelle: 'Auteurs' },
        { valeur: data.totalEmprunts, libelle: 'Emprunts' },
    ];

    const raccourcis = [
        { to: '/api/user', libelle: 'Gérer les utilisateurs' },
        { to: '/api/book', libelle: 'Gérer les livres' },
        { to: '/api/book/add', libelle: 'Ajouter un livre' },
        { to: '/api/emprunt', libelle: 'Gérer les emprunts' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-center mb-6">Tableau de bord</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {cartes.map((carte) => (
                    <div key={carte.libelle} className="bg-white shadow-md rounded p-4 text-center">
                        <p className="text-2xl font-bold text-blue-500">{carte.valeur}</p>
                        <p className="text-sm text-gray-600">{carte.libelle}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {raccourcis.map((raccourci) => (
                    <Link key={raccourci.to} to={raccourci.to}>
                        <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                            {raccourci.libelle}
                        </button>
                    </Link>
                ))}
            </div>

            <h2 className="text-xl font-medium mb-3">Derniers emprunts</h2>

            {data.derniersEmprunts.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="border-collapse border-2 border-gray-500 w-full table-auto">
                        <thead>
                            <tr>
                                <th className="border-2 border-gray-500 text-center p-2">Livre</th>
                                <th className="border-2 border-gray-500 text-center p-2">Utilisateur</th>
                                <th className="border-2 border-gray-500 text-center p-2">Date d'emprunt</th>
                                <th className="border-2 border-gray-500 text-center p-2">Date de retour</th>
                                <th className="border-2 border-gray-500 text-center p-2">Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.derniersEmprunts.map((emprunt) => (
                                <tr key={emprunt.id}>
                                    <td className="border-2 border-gray-500 text-center p-2">{emprunt.livre}</td>
                                    <td className="border-2 border-gray-500 text-center p-2">{emprunt.utilisateur}</td>
                                    <td className="border-2 border-gray-500 text-center p-2">
                                        {new Date(emprunt.dateEmprunt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="border-2 border-gray-500 text-center p-2">
                                        {new Date(emprunt.dateRetour).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="border-2 border-gray-500 text-center p-2">
                                        <Link to={`/api/emprunt/${emprunt.id}`}>
                                            <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded">
                                                Détails
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Aucun emprunt pour le moment.</p>
            )}
        </div>
    );
};

export default AdminDashboard;
