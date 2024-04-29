import { PUBLIC_API_URL } from "$env/static/public";

export const getRules = async (siteId: string, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/sites/${siteId}/rules`, { credentials: "include"});

    const {data: rules, total} = await resonse.json();

    return {rules, total};
}

export const getRule = async (ruleId: string, fetch: typeof window.fetch) => {
    const resonse = await fetch(`${PUBLIC_API_URL}/rules/${ruleId}`, { credentials: "include"});

    return resonse.json();
}


export const createRule = async (siteId: string, rule: any, fetch: typeof window.fetch) => {
    const response = await fetch(`${PUBLIC_API_URL}/sites/${siteId}/rules`, {
        method: "POST",
        body: JSON.stringify(rule),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    return response.json();
}