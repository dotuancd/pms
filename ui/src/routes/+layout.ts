import { goto } from "$app/navigation";
import { getMe } from "$lib/api/auth";
import type { LayoutLoad } from "./$types";

let user: any = null;
export const load: LayoutLoad = async ({fetch, url}) => {

    if (user || url.pathname.startsWith("/login")) {
        return {}
    }

    user = await getMe(fetch)

    if (! user) {
        return goto("/login")
    }
}

export const ssr = false;