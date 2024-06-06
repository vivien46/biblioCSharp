import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FunctionComponent = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('https://localhost:7153/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Username: username, Email: email, PasswordHash: password, Emprunts: [] })
            });

            if (response.ok){
                setMessage('Enregistrement réussi ! Vous allez être redirigé...');
                setTimeout(() => navigate('/'), 15000);
            } else {

            const data = await response.json();
            setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('Erreur lors de l\'enregistrement');
        }
    };

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center font-medium text-2xl mb-5">Register</h1>

            <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <label htmlFor="username" className="text-center font-medium text-lg">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="email" className="text-center font-medium text-lg">Email</label>
                    <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="password" className="text-center font-medium text-lg">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</button>
                </form>

                {message && <p className="text-center mt-5">{message}</p>}
            </div>
        </div>
    );
}

export default RegisterForm;