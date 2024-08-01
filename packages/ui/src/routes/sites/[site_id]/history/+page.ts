import type { PageLoad } from "./$types";
import { getSite } from "$lib/api/sites";
import { getHistory } from "$lib/api/history";

export const load: PageLoad = async ({fetch, params}) => {

    const site = await getSite(params.site_id, fetch);

    const history = await getHistory(params.site_id || '', fetch);

    return {
        site,
        history
    }
}