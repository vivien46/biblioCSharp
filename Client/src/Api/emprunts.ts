import { useEffect, useState } from "react";

// Interface pour représenter les données d'un emprunt
interface Emprunt {
    id: number;
    dateEmprunt: Date;
    dateRetour: Date;
    livre: {
        id: number;
        titre: string;
    };
    user: {
        id: number;
        nom: string;
    };
}

// Custom hook pour récupérer les emprunts
function useEmprunts() {
    const [emprunts, setEmprunts] = useState<Emprunt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmprunts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch("https://localhost:7153/api/emprunt");
                if (!res.ok) {
                    throw new Error("Impossible de charger les emprunts");
                }
                const data: Emprunt[] = await res.json();
                setEmprunts(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Une erreur inconnue s\'est produite.');
                }
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmprunts();
    }, []);

    return { emprunts, isLoading, error };
}

export default useEmprunts;