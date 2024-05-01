import type { PageLoad } from "./$types";
import { getTeam } from "$lib/api/teams";
import { getMembers } from "$lib/api/members";

export const load: PageLoad = async ({fetch, params}) => {
    const {members, total} = await getMembers(params.team_id, fetch);
    const team = await getTeam(params.team_id, fetch);

    return {
        ...team,
        members,
        total
    }
}