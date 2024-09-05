import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById } from '../../Api/users';

interface UserUpdateData {
    username: string;
    passwordHash?: string;
    email: string;
    role: number;
    emprunts?: any[];
}

const UserEditForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = React.useState<UserUpdateData>({username: '', passwordHash:'', email: '', role: 0, emprunts: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const UserToUpdate = await getUserById(Number(id));
                if (UserToUpdate) {
                    setUser({...UserToUpdate, username: UserToUpdate.username, email: UserToUpdate.email, role: UserToUpdate.role });
                    setLoading(false);
                } else {
                    setError('Utilisateur non trouvé');
                }
            }catch (error: any) {
                setError('Impossible de charger les données : ' + error);
                setLoading(false);
            }
    };
fetchData();
}, [id]);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // console.log(`Field ${name}, value ${value}`);
        if (name === 'role') {
            setUser(prevState => ({ ...prevState, role: Number(value) }));
        } else
        setUser({ ...user, [name]: value });
        
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const { passwordHash, emprunts, ...userWithoutPassword } = user;
            const formData = new FormData();
            formData.append('username', userWithoutPassword.username);
            formData.append('email', userWithoutPassword.email);
            const roleNumber = userWithoutPassword.role.toString() === '0' ? 0 : 1;
            formData.append('role', roleNumber.toString());

        // console.log("Données à envoyer :", formData);
        // for(let pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        const response = await fetch(`https://localhost:7153/api/user/edit/${id}`, {
            method: 'PUT',
            body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erreur lors de la mise à jour de l'utilisateur. Statut: ${response.status}, Message: ${errorText}`);
            }
            
            // const data = await response.json();
            // console.log("Utilisateur mis à jour : ", data);

            window.alert("L'utilisateur à été mis à jour avec succès");
            navigate(`/api/user/${id}`);

        }catch(error) {
            if (error instanceof Error) {
                setError("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
                window.alert("Erreur lors de la mise à jour de l'utilisateur : " + error.message);
            }else {
                setError("Une erreur inconnue s'est produite lors de la mise à jour de l'utilisateur");
                window.alert("Une erreur inconnue s'est produite lors de la mise à jour de l'utilisateur");
            }
        }
    }

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>Une erreur s'est produite : {error}</p>;
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
                        <option value={1}>Admin</option>
                        <option value={0}>User</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update User</button>
            </form>
        </div>
    );
};
export default UserEditForm;