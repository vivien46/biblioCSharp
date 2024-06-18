import React from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../Api/users";

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        getUserById(Number(id))
            .then((data: any) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error: any) => {
                console.error("erreur lors de la récupération des données :", error);
                setError("Impossible de charger les données");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
if (user) {
    return (
        <div>
            <h1 className="font-bold text-xl text-center mb-3">User Profile</h1>
            <table className="border-collapse border-2 border-gray-500 mt-5 w-full mb-3">
                <thead>
                    <tr>
                        <th className="border-2 border-gray-500 text-center p-2">Username</th>
                        <th className="border-2 border-gray-500 text-center p-2">Email</th>
                        <th className="border-2 border-gray-500 text-center p-2">Role</th>
                    </tr>
                </thead>
                <tbody className="border-2 border-gray-500">
                    <tr className="border-2 border-gray-500">
                        <td className="border-2 border-gray-500 text-center p-2">{user.username}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{user.email}</td>
                        <td className="border-2 border-gray-500 text-center p-2">{user.role === 0 ? 'User' : 'Admin'}</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <Link to={`/api/user/edit/${id}`}>
                    <button type="button" className="bg-green-500 p-2 rounded-md">Edit User</button>
                </Link>
            </div>
        </div>
    );
}
return user;

};

export default UserProfile;