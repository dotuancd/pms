import { PUBLIC_API_URL } from "$env/static/public";

export const getMembers = async (teamId: any, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/teams/${teamId}/members`, { credentials: "include"});

    const {data: members, total} = await resonse.json();

    return {
        members,
        total
    }
}