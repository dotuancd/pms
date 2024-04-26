import { AppDataSource } from "../../lib/server/data-source";
import { Site } from "../../lib/server/entity/Site";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {

    const repository = AppDataSource.getRepository(Site)

    const [sites, total] = await repository.findAndCount()

    return {
        sites: sites.map(site => JSON.parse(JSON.stringify(site))),
        total
    };
};