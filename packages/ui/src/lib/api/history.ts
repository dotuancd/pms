import { PUBLIC_API_URL } from "$env/static/public";

export const getHistory = async (siteKey: string, fetch: typeof window.fetch) => {
  const resonse = await fetch(`${PUBLIC_API_URL}/history/${siteKey}`, { credentials: "include"});

  return resonse.json();
}