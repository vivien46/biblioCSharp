import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEmpruntById } from "../../Api/emprunts";

interface EmpruntDetailProps {
    id: number;
    dateEmprunt: string;
    dateRetour: string;
    livre: {
        id: number;
        titre: string;
        auteur: string;
        editeur: string;
    };
    user: {
        id: number;
        username: string;
        email: string;
    };
}

const EmpruntDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract 'id' from URL params
    const [emprunt, setEmprunt] = useState<EmpruntDetailProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empruntData = await getEmpruntById(Number(id));
                setEmprunt(empruntData);
                setLoading(false);
            } catch (error: any) {
                setError("Impossible de charger les détails de l'emprunt : " + error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (dateString: string) : string => {
        const options: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", options);
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>Une erreur s'est produite : {error}</p>;
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white border rounded shadow-md m-5">
            <h1 className="text-2xl font-bold mb-4">Détails de l'emprunt</h1>
            {emprunt && (
                <table className="w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Date d'emprunt</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(emprunt.dateEmprunt)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Date de retour</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatDate(emprunt.dateRetour)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Livre</td>
                            <td className="px-6 py-4 whitespace-normal break-words max-w-xs">{emprunt.livre.titre} (Auteur: {emprunt.livre.auteur}, Éditeur: {emprunt.livre.editeur})</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Utilisateur</td>
                            <td className="px-6 py-4 whitespace-nowrap">{emprunt.user.username} </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmpruntDetail;