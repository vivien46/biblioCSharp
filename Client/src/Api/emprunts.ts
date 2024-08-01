export const empruntsApi = async () => {
    const res = await fetch("https://localhost:7153/api/emprunt");

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}

export const getEmpruntById = async (id: number) => {
    const res = await fetch(`https://localhost:7153/api/emprunt/${id}`);

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}

export const updateEmprunt = async (id: number, updatedEmprunt: any) => {
    const res = await fetch(`https://localhost:7153/api/emprunt/edit/${id}`, {
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