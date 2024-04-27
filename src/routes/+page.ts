import type { PageLoad } from "./$types";

export const load: PageLoad = async ({data}) => {
    const users = data.users;
    return {
        users
    };
}