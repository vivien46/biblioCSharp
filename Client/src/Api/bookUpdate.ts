export const updateBook = async (id: string, bookData: any, imageFile: File | null) => {
    
    const formData = new FormData();
    
    for (const key in bookData) {
        formData.append(key, key === 'annee' ? bookData[key].toString() : bookData[key]);
    }

    if (imageFile) {
        formData.append("image", imageFile);
    }
    
    console.log("FormData avant envoi :", formData);
    try {
        const response = await fetch(`https://localhost:7153/api/book/edit/${id}`, {
            method: "PUT",
            body: formData
        });

        console.log("Réponse de l'API :", response);

        if (!response.ok) {
            throw new Error("Impossible de mettre à jour le livre");
        }
        return;
    } catch (error) {
        throw new Error("Impossible de mettre à jour le livre :" + error);
    }
};