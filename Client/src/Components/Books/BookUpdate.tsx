import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookById, updateBook } from "../../Api/books";

interface BookUpdateData {
    titre: string;
    auteur: string;
    editeur: string;
    annee: number;
    isbn: string;
    imageUrl: string;
    image?: File | null;
    emprunts: any[];
}

const BookUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<BookUpdateData>({ titre: '', auteur: '', editeur: '', annee: 0, isbn: '', imageUrl: '', image: null, emprunts: [] });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookToUpdate = await getBookById(Number(id));
                if (bookToUpdate) {
                    setBook(bookToUpdate);
                } else {
                    console.error("Livre non trouvé");
                }
            } catch (error) {
                console.error("Impossible de charger les données :", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBook({ ...book, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("titre", book.titre);
            formData.append("auteur", book.auteur);
            formData.append("editeur", book.editeur);
            formData.append("annee", book.annee.toString());
            formData.append("isbn", book.isbn);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            console.log("Données du livre :", formData);
            console.log("Fichier image :", imageFile);

         await updateBook(Number(id), formData);
        
            navigate("/api/book");
        } catch (error) {
            console.error("Impossible de mettre à jour le livre :", error);
        }
    };
    return (
        <div className="container mx-auto p-6">
            <h1 className="font-bold text-xl text-center mb-3">Update the Book</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        name="titre"
                        value={book.titre || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Author</label>
                    <input
                        type="text"
                        name="auteur"
                        value={book.auteur || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Editor</label>
                    <input
                        type="text"
                        name="editeur"
                        value={book.editeur || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Year</label>
                    <input
                        type="number"
                        name="annee"
                        value={Number(book.annee || '')}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">ISBN</label>
                    <input
                        type="text"
                        name="isbn"
                        value={book.isbn || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Current Image</label>
                    {book.imageUrl ? (
                        <div>
                            <img src={`/assets/Images/Livres/${book.imageUrl}`} alt={book.titre} className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            <p className="mt-1">{book.imageUrl}</p>
                        </div>
                    ) : (
                        <p className="mt-1">None</p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Choose New Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {imageFile && (
                        <div>
                            <img src={URL.createObjectURL(imageFile)} alt="Selected Image" className="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />

                        </div>
                    )}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </form>
        </div>
    );
}

export default BookUpdate;
