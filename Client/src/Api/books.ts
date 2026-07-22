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

export const getRecentBooks = async (pageNumber: number = 1, pageSize: number = 5) => {
    const res = await fetch(`${API_BASE_URL}/Book/recent?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    if (!res.ok) {
        throw new Error("Impossible de charger les livres récents");
    }
    const data = await res.json();
    
    if (data.books && data.books.$values && Array.isArray(data.books.$values)) {
        const transformedData = data.books.$values.map((book: any) => ({
            id: book.id,
            titre: book.titre,    
            auteur: book.auteur,    
            imageUrl: book.imageUrl ? `${API_BASE_URL}/Book/images/${book.imageUrl}` : null,
            annee: book.annee,  
            editeur: book.editeur,
            isbn: book.isbn,
        }));
        return {
            books: transformedData,
            totalItems: data.totalItems,
            PageNumber: data.pageNumber,
            PageSize: data.pageSize,
            TotalPages: data.totalPages
        };
    } else {
        throw new Error("Les données reçues ne sont pas dans le format attendu");
    }
};

export const getStats = async () => {
    const res = await fetch(`${API_BASE_URL}/Book/stats`);
    if (!res.ok) {
        throw new Error("Impossible de charger les statistiques");
    }
    return await res.json();
};
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