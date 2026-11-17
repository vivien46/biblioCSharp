// Les cookies d'authentification (HttpOnly) doivent accompagner chaque requête vers l'API,
// y compris cross-origin (front -> API), d'où credentials: 'include'.
export const apiFetch = (input: string, init: RequestInit = {}) =>
    fetch(input, { credentials: 'include', ...init });
