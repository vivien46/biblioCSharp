import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserDelete: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Remplacez ceci par votre propre logique de suppression
    fetch(`https://localhost:7153/api/user/delete/${id}`, { method: 'DELETE' })
      .then(() => {
        // Redirigez vers la page des utilisateurs après la suppression
        navigate('/api/user');
        setLoading(false);
        setMessage("Utilisateur supprimé avec succès.");
      });
  }, [id]);

  // Vous pouvez afficher un message de chargement ou une autre interface utilisateur pendant la suppression
  return <div>
    {message ? message : "Suppression de l'utilisateur..."}
  </div>;
}

export default UserDelete;