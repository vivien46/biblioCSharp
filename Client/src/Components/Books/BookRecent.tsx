import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentBooks } from "../../Api/books";

interface Book {
    id: number;
    titre: string;
    auteur: string;
    editeur?: string;
    annee?: number;
    imageUrl?: string;
}

const BooksRecent: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const result = await getRecentBooks(1, 8);
                setBooks(result.books);
            } catch (err: any) {
                setError(err.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-700">Chargement des livres récents...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    if (books.length === 0) {
        return <p className="text-center text-gray-500">Aucun livre récent pour le moment.</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Livres récents</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {books.map((book) => (
                    <div key={book.id} className="bg-white shadow-md rounded p-3 flex flex-col items-center">
                        <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded">
                            {book.imageUrl ? (
                                <img
                                    src={book.imageUrl}
                                    alt={book.titre}
                                    className="h-full w-full object-cover rounded"
                                    loading="lazy"
                                />
                            ) : (
                                <p className="text-sm text-gray-500">Pas d'image</p>
                            )}
                        </div>
                        <h3 className="text-sm font-semibold mt-2 text-center">{book.titre}</h3>
                        <p className="text-xs text-gray-600">{book.auteur}</p>
                        <Link
                            to={`/api/book/${book.id}`}
                            className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Voir le livre
                        </Link>
                    </div>
                ))}
            </div>
            <div className="text-center mt-6">
                <Link
                    to="/api/book"
                    className="text-blue-500 hover:underline text-sm"
                >
                    Voir tous les livres →
                </Link>
            </div>
        </div>
    );
};

export default BooksRecent;