
import express, { Router } from "express";
import { ForwardRequestStrategy } from "../application/strategies/ForwardRequestStrategy";
import { RatesResponseStrategy } from "../application/strategies/RatesResponseStrategy";
import { CountBasedResponseStrategy } from "../application/strategies/CountBasedResponseStrategy";
import { StaticResponseStrategy } from "../application/strategies/StaticResponseStrategy";
import { Rule } from "../application/match_rules/Rule";
import { RuleMatcher } from "../application/match_rules/RuleMatcher";
import { AppDataSource } from "../src/data-source";
import { z } from "zod";
import { pbkdf2 } from "crypto"
import { Password } from "../application/shared/password";
import { User } from "../src/entity/User";
import { Team } from "../src/entity/Team";
import { Site } from "../src/entity/Site";
import { Rule as RuleEntity } from "../src/entity/Rule";
import nanoid from "../application/shared/nanoid";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { manager as strategyFactory } from "../application/strategies/ResponseStrategyFactory";

process.loadEnvFile();
import { Jwt } from "../application/shared/jwt";
import auth from "../adapters/primary/middlewares/auth";
import TeamRoutes from "../adapters/primary/routes/TeamRoutes";
import AuthRoutes from "../adapters/primary/routes/AuthRoutes";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))
app.use(express.json());
app.set("x-powered-by", false);
app.use(morgan("short"));
app.use(cookieParser())

const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/teams", TeamRoutes)
app.use(AuthRoutes)

app.post("/sites/:siteId/rules", auth, async (req, res) => {
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

app.get("/rules/:ruleId", auth, async (req, res) => {
  // create rule
  const siteId = Number(req.params.ruleId);
  const rule = await AppDataSource.manager.getRepository(RuleEntity).findOne({where: {id: siteId}});
  res.send(rule);
})

app.get("/sites/:siteId", auth, async (req, res) => {
  const siteId = req.params.siteId;
  const site = await AppDataSource.manager.getRepository(Site).findOne({
    where: {id: siteId},
    relations: ["team"]
  });

  res.send(site);
})

app.get("/sites/:siteId/rules", auth, async (req, res) => {

  const siteId = req.params.siteId;
  const [data, total] = await AppDataSource.manager.getRepository(RuleEntity).findAndCount({where: {site: {id: siteId}}});

  res.send({data, total});
})

app.all("/p/:siteKey/*", async (req, res) => {
  const site = await AppDataSource.getRepository(Site).findOne({
    where: {id: req.params.siteKey},
    relations: ["rules"]
  });

  if (!site) {
    return res.status(404).send("Site not found");
  }

  const rules = site.rules.map((rule) => {
    return new Rule(
      rule.methods,
      rule.routes,
      null,
      strategyFactory.create(rule.strategy.type, rule.strategy.options),
    )
  })

  const matchRule = rules.find((rule) => rule.isMatch(req));

  const strategy = matchRule?.strategy || new ForwardRequestStrategy();

  return strategy.build(req, res);
})

AppDataSource.initialize().then(() => {
  console.log("Database connected");
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
  
});