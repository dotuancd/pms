import { getTeam } from "$lib/api/teams";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({fetch, params}) => {
    return getTeam(params.team_id, fetch);
}