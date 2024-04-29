import type { PageLoad } from "../../rules/[site_id]/$types";
import { getRules } from "$lib/api/rules";
import { getSite } from "$lib/api/sites";

export const load: PageLoad = async ({fetch, params}) => {

    const site = await getSite(params.site_id, fetch);

    const {rules, total} = await getRules(params.site_id, fetch);

    return {
        site,
        rules,
        total
    }
}