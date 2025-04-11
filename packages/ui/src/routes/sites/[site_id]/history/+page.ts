import type { PageLoad } from "./$types";
import { getSite } from "$lib/api/sites";
import { getHistory } from "$lib/api/history";

export const load: PageLoad = async ({fetch, params, url}) => {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const site = await getSite(params.site_id, fetch);
    const historyData = await getHistory(params.site_id || '', fetch, { page, limit });
    
    return {
        site,
        historyData,
        pagination: {
            page,
            limit
        }
    }
}