import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../../Api/books";

const BookList: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
      const fetchBooks = async () => {
        try {
          const data = await getAllBooks();
          console.log("Données brutes reçues de l'API :", data);
           if(data) {
            setBooks(data);
           } else {
            setError("Les données transformées ne sont pas un tableau.");
           }
        } catch (error: any) {
          console.error("Erreur lors de la récupération des données :", error);
          setError("Impossible de charger les données");
        } finally {
          setLoading(false);
        }
      };
      fetchBooks();
    }, []);
  
    if (loading) {
      return <p>Chargement...</p>;
    }
  
    if (error) {
      return <p>{error}</p>;
    }

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-center font-medium text-2xl mb-5">Liste des livres</h2>

      <div className="border">
        <Link to="/api/book/add">
          <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-1 px-2 rounded">
            Ajouter un Livre
          </button>
        </Link>
      </div>

      {books.length > 0 ? (
        <table className="border-collapse border-2 border-gray-500 mt-5 w-full">
          <thead>
            <tr>
              <th className="border-2 border-gray-500 text-center p-2">Titre</th>
              <th className="border-2 border-gray-500 text-center p-2">Auteur</th>
              <th className="border-2 border-gray-500 text-center p-2">Editeur</th>
              <th className="border-2 border-gray-500 text-center p-2">Année</th>
              <th className="border-2 border-gray-500 text-center p-2">ISBN</th>
              <th className="border-2 border-gray-500 text-center p-2">Image</th>
              <th className="border-2 border-gray-500 text-center p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="border-2 border-gray-500 text-center p-2">{book.titre}</td>
                <td className="border-2 border-gray-500 text-center p-2">{book.auteur}</td>
                <td className="border-2 border-gray-500 text-center p-2">{book.editeur}</td>
                <td className="border-2 border-gray-500 text-center p-2">{book.annee}</td>
                <td className="border-2 border-gray-500 text-center p-2">{book.isbn}</td>
                <td className="border-2 border-gray-500 text-center p-1">
                  {book.imageUrl ? (
                    <div className="flex flex-row justify-center">
                      <img
                        src={`/assets/Images/Livres/${book.imageUrl}`}
                        alt={book.titre}
                        className="h-30 w-20 p-1"
                      />
                    </div>
                  ) : (
                    <p>Pas d'image</p>
                  )}
                </td>
                <td className="border-2 border-gray-500 text-center p-2">
                  <Link to={`/api/book/${book.id}`}>
                    <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded">
                      Détails
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun livre trouvé</p>
      )}
    </div>
  );
};

export default BookList;