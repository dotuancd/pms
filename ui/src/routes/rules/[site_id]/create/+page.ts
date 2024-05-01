import { getSite } from "$lib/api/sites";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch, params}) => {
    return getSite(params.site_id, fetch);
}