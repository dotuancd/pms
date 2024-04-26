import type { PageLoad } from './$types';

export const load: PageLoad = ({ data }) => {

    console.log(data);
    return {
        sites: data.sites,
        total: data.total
    };
};