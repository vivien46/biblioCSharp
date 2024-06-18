export const usersApi = async () => {
    const res = await fetch("https://localhost:7153/api/user");

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}

export const getUserById = async (id: number) => {
    const res = await fetch(`https://localhost:7153/api/user/${id}`);

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}

export const updateUser = async (id: number, updatedUser: any) => {
    const res = await fetch(`https://localhost:7153/api/user/edit/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'data/form'
        },
        body: updatedUser
    });

    if (!res.ok) {
        throw new Error("Impossible de mettre à jour l'utilisateur");
    }

    // Attendre que le corps de la réponse soit parsé en JSON
    const user = await res.json();
    console.log(user); // Afficher le contenu du corps de la réponse

    return user;
}