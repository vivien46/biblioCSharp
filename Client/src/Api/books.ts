const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllBooks = async () => {
    const res = await fetch(`${API_BASE_URL}/Book`);
    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
   
    if (data.$values && Array.isArray(data.$values)) {
        const transformedData = data.$values.map((book: any) => ({
            id: book.id,
            titre: book.titre,    
            auteur: book.auteur,    
            annee: book.annee,  
            editeur: book.editeur,
            isbn: book.isbn,
            imageUrl: book.imageUrl,
        }));
        return transformedData;
    } else {
        throw new Error("Les données transformées ne sont pas un tableau");
    }
}

export const getBookById = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/Book/${id}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les données");
    }
    const data = await res.json();
    
    return data;
}

// export const updateBook = async (id: number, formData : FormData) => {

//     const response = await fetch(`${API_BASE_URL}/Book/edit/${id}`, {
//         method: "PUT",
//         body: formData
//     });

//     if (!response.ok) {
//         return;
//     }

//     return await response.json();
// };