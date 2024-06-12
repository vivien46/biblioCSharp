import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../Api/users';

const UserEditForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUserById(Number(id))
            .then((data: any) => {
                setUser(data);
                setLoading(false);
            })
            .catch((error: any) => {
                console.error('erreur lors de la récupération des données :', error);
                setError('Impossible de charger les données');
                setLoading(false);
            });
    }, [id]);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
        console.log(user);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log(user);
            const updatedUSer = await updateUser(Number(id), user);
            console.log(updatedUSer);
            setUser(updatedUSer);
            navigate(`/user/${id}`);

        } catch (error) {
            console.error('erreur lors de la mise à jour de l\'utilisateur :', error);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Modify User</h1>
            <form className="max-w-sm" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2">Username</label>
                    <input type="text" id="username" name="username" value={user.username} onChange={handleChanges} className="border border-gray-300 rounded px-4 py-2 w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input type="email" id="email" name="email" value={user.email} onChange={handleChanges} className="border border-gray-300 rounded px-4 py-2 w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor='role' className="block mb-2">Role</label>
                    <select name='role' id='role' value={user.role} onChange={handleChanges} className="border border-gray-300 rounded px-4 py-2 w-full">
                        <option value='admin'>Admin</option>
                        <option value='user'>User</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update User</button>
            </form>
        </div>
    );
};
export default UserEditForm;