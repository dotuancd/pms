import type { PageServerLoad } from "./$types";
import { AppDataSource } from "$lib/server/data-source";
import { User } from "$lib/entity/User";

export const load: PageServerLoad = async (context) => {

  const users = await AppDataSource.manager.getRepository(User).find();

  return {
    users: users.map(user => ({...user}))
  };
};