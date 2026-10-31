import React, { useState } from 'react';
import { requestPasswordReset } from '../Api/password';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            setMessage(await requestPasswordReset(email));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 bg-white shadow-md rounded p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Mot de passe oublié</h1>

            <p className="text-gray-600 mb-4 text-center">
                Saisissez l'adresse email de votre compte : nous vous enverrons un lien pour choisir un nouveau mot de passe.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="votre@email.fr"
                        autoComplete="email"
                        required
                    />
                </div>

                <input
                    type="submit"
                    value={submitting ? "Envoi..." : "Envoyer le lien"}
                    disabled={submitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </form>

            {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
    );
};

export default ForgotPasswordPage;
