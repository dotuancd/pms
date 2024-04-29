import { PUBLIC_API_URL } from "$env/static/public";

export const getTeams = async (fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/teams`, { credentials: "include"});

    const {data: teams, total} = await resonse.json();

    return {teams, total};
}


export const getTeam = async (teamId: any, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/teams/${teamId}`, { credentials: "include"});

    return resonse.json();
}

export const createTeam = async (team: any, fetch: typeof window.fetch) => {
    const response = await fetch(`${PUBLIC_API_URL}/teams`, {
        method: "POST",
        body: JSON.stringify(team),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    return response.json();
}