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