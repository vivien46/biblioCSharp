import { apiFetch } from './http';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface DernierEmprunt {
    id: number;
    dateEmprunt: string;
    dateRetour: string;
    livre: string;
    utilisateur: string;
}

export interface Dashboard {
    totalBooks: number;
    totalAuteurs: number;
    totalUsers: number;
    totalEmprunts: number;
    derniersEmprunts: DernierEmprunt[];
}

export const getDashboard = async (): Promise<Dashboard> => {
    const res = await apiFetch(`${API_BASE_URL}/admin/dashboard`);
    if (!res.ok) {
        throw new Error("Impossible de charger le tableau de bord");
    }
    const data = await res.json();

    // Les listes sont sérialisées avec $values (ReferenceHandler.Preserve)
    const emprunts = data.derniersEmprunts?.$values ?? data.derniersEmprunts ?? [];

    return {
        totalBooks: data.totalBooks,
        totalAuteurs: data.totalAuteurs,
        totalUsers: data.totalUsers,
        totalEmprunts: data.totalEmprunts,
        derniersEmprunts: emprunts.map((e: any) => ({
            id: e.id,
            dateEmprunt: e.dateEmprunt,
            dateRetour: e.dateRetour,
            livre: e.livre,
            utilisateur: e.utilisateur,
        })),
    };
};
