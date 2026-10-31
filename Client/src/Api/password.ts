import { apiFetch } from './http';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const requestPasswordReset = async (email: string): Promise<string> => {
    const formData = new FormData();
    formData.append('email', email);

    const res = await apiFetch(`${API_BASE_URL}/user/forgot-password`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        throw new Error("Impossible d'envoyer la demande pour le moment.");
    }
    const data = await res.json();
    return data.message;
};

export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('newPassword', newPassword);

    const res = await apiFetch(`${API_BASE_URL}/user/reset-password`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const data = await res.json();
    return data.message;
};
