import type { PageLoad } from "./$types";
import { getRule } from "$lib/api/rules";

export const load: PageLoad = async ({fetch, params}) => {
    return getRule(params.rule_id, fetch);
}