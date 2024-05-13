
import { PUBLIC_API_URL } from "$env/static/public";

export const getSites = async (teamId: string, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/teams/${teamId}/sites`, { credentials: "include"});

    const {data: sites, total} = await resonse.json();

    return {sites, total};
}

export const getSite = async (siteId: string, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/sites/${siteId}`, { credentials: "include"});

    return await resonse.json();
}

export const createSite = async (teamId: string, site: any, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/teams/${teamId}/sites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(site),
        credentials: "include"
    });

    return await resonse.json();
}

export const updateSite = async (siteId: string, site: any, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/sites/${siteId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(site),
        credentials: "include"
    });

    return await resonse.json();
}

export const deleteSite = async (siteId: string, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/sites/${siteId}`, {
        method: "DELETE",
        credentials: "include"
    });

    return resonse.status === 204;
}
