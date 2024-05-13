import { Router } from "express";
import auth from "../middlewares/auth";
import { AppDataSource } from "../../../src/data-source";
import { Site } from "../../../src/entity/Site";
import { Rule as RuleEntity } from "../../../src/entity/Rule";
import { z } from "zod";

const router = Router();

router.use(auth);

router.get("/:siteId", async (req, res) => {
  const siteId = req.params.siteId;
  const site = await AppDataSource.manager.getRepository(Site).findOne({
    where: {id: siteId},
    relations: ["team"]
  });

  res.send(site);
})

router.delete("/:siteId", async (req, res) => {
  const siteId = req.params.siteId;
  await AppDataSource.manager.getRepository(Site).delete(siteId);
  res.status(204).send();
})
  
router.get("/:siteId/rules", async (req, res) => {
  const siteId = req.params.siteId;
  const [data, total] = await AppDataSource.manager.getRepository(RuleEntity).findAndCount({where: {site: {id: siteId}}});

  res.send({data, total});
})

router.put("/:siteId", async (req, res) => {
  const siteId = req.params.siteId;
  const site = await AppDataSource.manager.getRepository(Site).findOne({where: {id: siteId}});
  const result = z.object({
    title: z.string().min(1),
    description: z.string().min(1).nullable().optional(),
  }).safeParse(req.body);

  if (! result.success) {
    return res.status(400).send(result.error);
  }

  site.title = result.data.title;
  site.description = result.data.description;

  const updated = await AppDataSource.manager.getRepository(Site).save(site);
  res.send(updated);
})

router.post("/:siteId/rules", async (req, res) => {
  // create rule

  const result = z.object({
    methods: z.array(z.string()).min(1),
    routes: z.array(z.string()).min(1),
    strategy: z.object({
      type: z.string().min(1),
      options: z.any(),
    }),
  }).safeParse(req.body);

  if (! result.success) {
    return res.status(400).send(result.error);
  }

  const siteId = req.params.siteId;
  const site = await AppDataSource.manager.getRepository(Site).findOne({where: {id: siteId}});

  const rule = new RuleEntity();
  rule.methods = result.data.methods;
  rule.routes = result.data.routes;
  // @ts-ignore
  rule.strategy = result.data.strategy;
  rule.site = site;

  const created = await AppDataSource.manager.getRepository(RuleEntity).save(rule);
  res.status(201).send(created);
})

export default router;