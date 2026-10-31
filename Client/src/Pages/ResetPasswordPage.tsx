import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../Api/password';

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        if (newPassword !== confirmation) {
            setError("Les deux mots de passe ne correspondent pas.");
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');
        try {
            setMessage(await resetPassword(token, newPassword));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="max-w-md mx-auto my-8 bg-white shadow-md rounded p-6 text-center">
                <p className="text-red-500">Lien incomplet. Demandez un nouveau lien de réinitialisation.</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto my-8 bg-white shadow-md rounded p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Nouveau mot de passe</h1>

            {message ? (
                <div className="text-center">
                    <p className="text-green-600 mb-4">{message}</p>
                    <Link to="/api/user/login" className="text-blue-600 underline">Se connecter</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block">Nouveau mot de passe</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="8 caractères minimum"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmation" className="block">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            id="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder="Confirmer le mot de passe"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <input
                        type="submit"
                        value={submitting ? "Enregistrement..." : "Enregistrer"}
                        disabled={submitting}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default ResetPasswordPage;
