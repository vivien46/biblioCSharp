import React, { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { booksApi } from '../../Api/books';

const BookList: React.FC = () => {
    const [books, setBooks] = useState<any>(null);

    useEffect(() => {
        booksApi()
          .then((data: any) => {
            // console.log(data);
            setBooks(data);
          })
          .catch((error: any) => {
            console.error('erreur lors de la r�cup�ration des donn�es :', error);
          });
      }, []);

    return (
            <div className="flex flex-col justify-center">
              <h2 className="text-center font-medium text-2xl mb-5">List of books</h2>
        
              <div className="border">
                <Link to="/api/book/add">
                  <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-1 px-2 rounded">Add Book</button>
                </Link>
              </div>
        
              {books ? (
                <table className="border-collapse border-2 border-gray-500 mt-5">
                  <thead>
                    <tr>
                      <th className="border-2 border-gray-500 text-center p-2">Title</th>
                      <th className="border-2 border-gray-500 text-center p-2">Author</th>
                      <th className="border-2 border-gray-500 text-center p-2">Editor</th>
                      <th className="border-2 border-gray-500 text-center p-2">Year</th>
                      <th className="border-2 border-gray-500 text-center p-2">ISBN</th>
                      <th className="border-2 border-gray-500 text-center p-2">Image</th>
                      <th className="border-2 border-gray-500 text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books && books.map((book: any, index: number) => (
                      <tr key={index}>
                        <td className="border-2 border-gray-500 text-center p-2">{book.titre}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{book.auteur}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{book.editeur}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{book.annee}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{book.isbn}</td>
                        <td className="border-2 border-gray-500 text-center p-1">
                          {book.imageUrl === null || book.imageUrl === '' ? (
                            <p>Pas d'image</p>
                          ) : (
                            <div className='image-cell'>
                              <img src={`/assets/Images/Livres/${book.imageUrl}`} alt={book.title} className="h-30 w-20" />
                            </div>
                          )}
                        </td>
                        <td className="border-2 border-gray-500 text-center p-2">
                          <Link to={`/api/book/${book.id}`}>
                            <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded">Details</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          );
};

export default BookList;