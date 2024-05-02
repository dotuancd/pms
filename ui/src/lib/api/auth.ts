import { PUBLIC_API_URL } from "$env/static/public";

export const login = (email: string, password: string, fetch: typeof window.fetch) => {
    return fetch(`${PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password}),
        credentials: "include"
    });
}

export const logout = (fetch: typeof window.fetch) => {
    return fetch(`${PUBLIC_API_URL}/logout`, {
        method: "POST",
        credentials: "include"
    });
}

export const getMe = async (fetch: typeof window.fetch) => {
    const response = await fetch(`${PUBLIC_API_URL}/me`, {
        credentials: "include"
    });

    if (response.status === 200) {
        return response.json();
    }

    return null;
}