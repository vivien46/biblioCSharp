import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface BookData {
   titre: string;
   auteur: string;
   editeur: string;
   annee: number;
   isbn: string;
   imageUrl: string;
}

const BookDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract 'id' from URL params
    const [bookData, setBookData] = useState<BookData | null>(null);
    const navigate = useNavigate();

    const getPreviousBook = async () => {
        try {
          const response = await fetch(`https://localhost:7153/api/book/previous/${id}`);
          if (response.ok) {
            const data = await response.json();
            navigate(`/api/book/${data.id}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    
      const getNextBook = async () => {
        try {
          const response = await fetch(`https://localhost:7153/api/book/next/${id}`);
          if (response.ok) {
            const data = await response.json();
            navigate(`/api/book/${data.id}`);
          }
        } catch (error) {
          console.error(error);
        }
      }

      const getRandomImageUrl = () => {
        const randomId = Math.floor(Math.random() * 1000); // Générer un identifiant aléatoire entre 0 et 999
        return `https://picsum.photos/200/350?random=${randomId}`; // Utiliser Picsum avec l'identifiant aléatoire
    };

    useEffect(() => {
        fetch(`https://localhost:7153/api/book/${id}`)
            .then(response => response.json())
            .then(data => setBookData(data))
            .catch(error => console.error(error));
    }, [id]);

    if (!bookData) {
        return <div>Loading...</div>;
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">{bookData.titre}</h2>

      
      <div className="flex flex-col md:flex-row items-center md:items-center">
        <div className="md:w-1/3 p-4">
        {bookData.imageUrl ? (
          <a href={`/assets/Images/Livres/${bookData.imageUrl}`} target="_blank" rel="noreferrer">
          <img 
            src={`/assets/Images/Livres/${bookData.imageUrl}`} 
            alt={bookData.titre} 
            className="w-full h-auto object-cover rounded-lg shadow-md" 
          />
          </a>
        ) : (
          <div className="flex flex-col justify-center">
          <img 
            src={getRandomImageUrl()} 
            alt="Image par défaut" 
            className="w-full h-auto object-cover rounded-lg shadow-md" 
          />
          <caption>
            <p className="text-sm text-gray-500">Image par défaut</p>
          </caption>
          </div>
        )}
        </div>
        <div className="md:w-2/3 p-4">
        <div className="mb-4">
          <p className="text-xl"><span className="font-bold">Author:</span> {bookData.auteur}</p>
          <p className="text-xl"><span className="font-bold">Editor:</span> {bookData.editeur}</p>
          <p className="text-xl"><span className="font-bold">Year:</span> {bookData.annee}</p>
          <p className="text-xl"><span className="font-bold">ISBN:</span> {bookData.isbn}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold mb-2 text-center">Résumé du Livre</h3>
          <p className="text-lg text-center">Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, voluptatum iure repellat quia consectetur soluta officiis, delectus dolorum unde nisi vel maxime facere quaerat omnis. Temporibus assumenda iusto blanditiis quos, sed laudantium id numquam repudiandae voluptas commodi doloremque rem! Libero quos ex quis cupiditate, culpa tenetur laboriosam quidem recusandae tempora.</p>
        </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-1">
        <button className="bg-blue-200 m-1 p-1 rounded-md" onClick={getPreviousBook} disabled={id === "1"}>Previous</button> <button className="bg-blue-700 m-1 p-1 rounded-md" onClick={getNextBook}>Next</button>
      </div>

      <div className="flex justify-center mt-6 gap-1">
          <Link to={`/api/book/edit/${id}`} className="bg-blue-200 m-1 p-1 rounded-md">Modifier</Link>
      </div>

      </div>
    );
  };

export default BookDetail;