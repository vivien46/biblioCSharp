import React, { useState, useEffect} from "react";
import { usersApi } from "../../Api/users";

const UserList: React.FC = () => {
    const [user, setUser] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        usersApi()
            .then((data: any) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error: any) => {
                console.error("erreur lors de la récupération des données :", error);
                setError("Impossible de charger les données");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {user.length > 0 ? (
                <table className="border-collapse border-2 border-gray-500 mt-5 w-full">
                    <thead>
                        <tr>
                            <th className="border-2 border-gray-500 text-center p-2">Username</th>
                            <th className="border-2 border-gray-500 text-center p-2">Email</th>
                            </tr>
                    </thead>
                    <tbody className="border-2 border-gray-500">
                        {user.map((user: any, index: number) => (
                            <tr key={index} className="border-2 border-gray-500">
                                <td className="border-2 border-gray-500 text-center p-2">{user.username}</td>
                                <td className="border-2 border-gray-500 text-center p-2">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>{error}</p>
            )}
        </div>
    );
};

export default UserList;