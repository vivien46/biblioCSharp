import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookAdd: React.FunctionComponent = () => {
    const [titre, setTitre] = useState("");
    const [auteur, setAuteur] = useState("");
    const [editeur, setEditeur] = useState("");
    const [annee, setAnnee] = useState<number | "">("");
    const [isbn, setISBN] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('Titre', titre);
        formData.append('Auteur', auteur);
        formData.append('Editeur', editeur);
        formData.append('Annee', annee.toString());
        formData.append('ISBN', isbn);
        if (image) {
            formData.append('ImageFile', image, image.name);
            formData.append('ImageUrl', image.name);
        }

        const empruntsJson = JSON.stringify([]);
        formData.append('Emprunts', empruntsJson);

        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        try {
            const response = await fetch('https://localhost:7153/api/book/add', {
                method: 'POST',
                body: formData
            });

            console.log(response);

            if (response.ok){
                setMessage('Livre ajouté avec succès ! Vous allez être redirigé...');
                setTimeout(() => navigate('/api/book/'), 15000);
            } else {
                const responseBody = await response.text();
                console.log(responseBody);
                setMessage("Erreur lors de l'ajout du livre");
            }
        } catch (error) {
            console.error(error);
            setMessage('Erreur lors de l\'ajout du livre');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0].name === "" ? null : event.target.files[0]);
        }
    };
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center font-medium text-2xl mb-5">Add Book</h1>

            <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <label htmlFor="titre" className="text-center font-medium text-lg">titre</label>
                    <input type="text" id="titre" name="Titre" value={titre} onChange={e => setTitre(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="auteur" className="text-center font-medium text-lg">auteur</label>
                    <input type="text" id="auteur" name="Auteur" value={auteur} onChange={e => setAuteur(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="editeur" className="text-center font-medium text-lg">editeur</label>
                    <input type="text" id="editeur" name="Editeur" value={editeur} onChange={e => setEditeur(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="annee" className="text-center font-medium text-lg">annee</label>
                    <input type="number" id="annee" name="Annee" value={annee === "" ? "" : Number(annee)} onChange={e => setAnnee(e.target.value === "" ? "" : Number(e.target.value))} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="isbn" className="text-center font-medium text-lg">ISBN</label>
                    <input type="text" id="isbn" name="ISBN" value={isbn} onChange={e => setISBN(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="imageUrl" className="text-center font-medium text-lg">Image</label>
                    <input type="file" id="imageUrl" name="ImageUrl" onChange={handleFileChange} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Book</button>
                </form>
                <p className="text-center mt-5">{message}</p>
            </div>
        </div>
    );
}

export default BookAdd;