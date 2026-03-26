
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const empruntsApi = async () => {
    const res = await fetch(`${API_BASE_URL}/Emprunt`);

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}

export const getEmpruntById = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/Emprunt/${id}`);

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    console.log('Données brutes reçues de l\'API :', data);

    const transformedData = {
        id: data.id,
        dateEmprunt: data.dateEmprunt,
        dateRetour: data.dateRetour,
        livre: data.livre,
        user: data.user
        }
        return transformedData;
    };

export const updateEmprunt = async (id: number, updatedEmprunt: any) => {
    const res = await fetch(`${API_BASE_URL}/Emprunt/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'data/form'
        },
        body: updatedEmprunt
    });

    if (!res.ok) {
        throw new Error("Impossible de mettre à jour l'emprunt");
    }

    // Attendre que le corps de la réponse soit parsé en JSON
    const emprunt = await res.json();
    console.log(emprunt); // Afficher le contenu du corps de la réponse

    return emprunt;
}

export const deleteEmprunt = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/Emprunt/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        throw new Error("Impossible de supprimer l'emprunt");
    }

    return res;
};