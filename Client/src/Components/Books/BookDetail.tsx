import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BookData {
  id?: number;
  titre: string;
  auteur: string;
  editeur: string;
  annee: number;
  isbn: string;
  imageUrl: string;
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getPreviousBook = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Book/previous/${id}`);
      if (!response.ok) return;

      const data = await response.json();
      navigate(`/api/book/${data.id}`);
    } catch {
      setError("Impossible de charger le livre précédent.");
    }
  };

  const getNextBook = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Book/next/${id}`);
      if (!response.ok) return;

      const data = await response.json();
      navigate(`/api/book/${data.id}`);
    } catch {
      setError("Impossible de charger le livre suivant.");
    }
  };

  const getRandomImageUrl = () => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/200/350?random=${randomId}`;
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Book/${id}`);
        if (!response.ok) {
          setError("Impossible de charger le livre.");
          return;
        }

        const data = await response.json();
        setBookData(data);
      } catch {
        setError("Une erreur est survenue lors du chargement du livre.");
      }
    };

    fetchBook();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">{bookData.titre}</h2>

      <div className="flex flex-col md:flex-row items-center md:items-center">
        <div className="md:w-1/3 p-4">
          {bookData.imageUrl && bookData.imageUrl.startsWith("http") ? (
            <a href={bookData.imageUrl} target="_blank" rel="noreferrer">
              <img
                src={bookData.imageUrl}
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
              <p className="text-sm text-gray-500">Image par défaut</p>
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
            <p className="text-lg text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
              voluptatum iure repellat quia consectetur soluta officiis, delectus dolorum
              unde nisi vel maxime facere quaerat omnis. Temporibus assumenda iusto
              blanditiis quos, sed laudantium id numquam repudiandae voluptas commodi
              doloremque rem! Libero quos ex quis cupiditate, culpa tenetur laboriosam
              quidem recusandae tempora.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-1">
        <button
          className="bg-blue-200 m-1 p-1 rounded-md"
          onClick={getPreviousBook}
          disabled={id === "1"}
        >
          Previous
        </button>
        <button
          className="bg-blue-700 m-1 p-1 rounded-md"
          onClick={getNextBook}
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mt-6 gap-1">
        <Link to={`/api/book/edit/${id}`} className="bg-blue-200 m-1 p-1 rounded-md">
          Modifier
        </Link>
      </div>
    </div>
  );
};

export default BookDetail;