import { Router } from "express";
import { AppDataSource } from "../../../src/data-source";
import { Team } from "../../../src/entity/Team";
import auth from "../middlewares/auth";
import { Site } from "../../../src/entity/Site";
import { z } from "zod"
import nanoid from "../../../application/shared/nanoid";
import { User } from "../../../src/entity/User";

const router = Router();

router.use(auth);

router.get("/", async (req, res) => {
    const [data, total] = await AppDataSource.manager.getRepository(Team).findAndCount({
        where: {
        users: {
            // @ts-ignore
            id: req.user.id
        }
        }
    });

    res.send({ data, total });
})

router.post("/", auth, async (req, res) => {

    const result = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }).safeParse(req.body);
  
    if (! result.success) {
      return res.status(400).send(result.error);
    }
  
    const {name, description} = result.data;
  
    const team = new Team();
    team.name = name;
    team.description = description;
    // @ts-ignore
    team.owner = req.user;
    // @ts-ignore
    team.users = [req.user];
  
    const created = await AppDataSource.manager.getRepository(Team).save(team);
  
    res.status(201).send(created);
})

router.get("/:teamId", auth, async (req, res) => {
    const team = await AppDataSource.manager.getRepository(Team).findOne({
        where: {
        id: Number(req.params.teamId)
        }
    });

    res.send(team);
})

router.get("/:teamId/sites", auth, async (req, res) => {  
    const teamId = Number(req.params.teamId);
    const [data, total] = await AppDataSource.manager.getRepository(Site).findAndCount({where: {
      team: {
        id: teamId
      }
    }
  });
  
    res.send({ data, total });
})

router.get("/:teamId/members", auth, async (req, res) => {
  const teamId = Number(req.params.teamId);
  const [data, total] = await AppDataSource.manager.getRepository(User).findAndCount({where: {
    teams: {
      id: teamId
    },
  }
});

  res.send({ data, total });
})

router.post("/:teamId/sites", auth, async (req, res) => {
    // create site
  
    const result = z.object({
      title: z.string().min(1),
      url: z.string().min(1).url().optional().nullable(),
      description: z.string().optional().nullable(),
    }).safeParse(req.body);
  
    if (! result.success) {
      return res.status(400).send(result.error);
    }
  
    const teamId = Number(req.params.teamId);
    const team = await AppDataSource.manager.getRepository(Team).findOne({where: {id: teamId}});
  
    const {title, url, description} = result.data;
    const site = new Site();
    site.id = nanoid(9);
    site.title = title;
    site.url = url;
    site.description = description;
    site.team = team;
  
    const created = await AppDataSource.manager.getRepository(Site).save(site);
    res.status(201).send(created);
})

export default router;