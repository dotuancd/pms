import type { PageLoad } from "./$types";
import { getTeams } from "$lib/api/teams";

export const load: PageLoad = async ({fetch}) => {
    const {teams, total} = await getTeams(fetch);

    return {
        teams,
        total
    }
}