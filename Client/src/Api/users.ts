export const usersApi = async () => {
    const res = await fetch("https://localhost:7153/api/user");

    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    return data;
}