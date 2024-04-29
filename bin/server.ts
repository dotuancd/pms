
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

const counterStorage = new Map<string, number>();

app.post("/login", async (req, res) => {

  const result = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(6),
  }).safeParse(req.body);

  if (! result.success) {
    return res.status(400).send(result.error);
  }

  const {email, password} = result.data;

  const user = await AppDataSource.manager.getRepository(User)
  .createQueryBuilder()
  .addSelect('User.password')
  .where({email})
  .getOne();

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  if (!Password.verify(password, user.password)) {
    return res.status(401).send("Invalid email or password");
  }

  delete user.password
  const token = await Jwt.encode({id: user.id})
  res.cookie("AUTH", token, {httpOnly: true, sameSite: process.env.AUTH_COOKIE_SAME_SITE as any, secure: process.env.AUTH_COOKIE_SECURE === "true"});
  return res.send({
    ...user,
    token
  });
  // return jwt
})

app.post("/register", (req, res) => {
  // create user

  const user = z.object({
    name: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(6),
  }).parse(req.body);

  user.password = Password.make(user.password);

  AppDataSource.manager.getRepository(User).save(user);

  res.send("User created");
})

app.post("/teams", auth, async (req, res) => {

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

app.post("/teams/:teamId/sites", auth, async (req, res) => {
  // create site

  const result = z.object({
    title: z.string().min(1),
    url: z.string().url().optional(),
    description: z.string().optional(),
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
  const site = await AppDataSource.manager.getRepository(Site).findOne({where: {id: siteId}});

  res.send(site);
})

app.get("/sites/:siteId/rules", auth, async (req, res) => {

  const siteId = req.params.siteId;
  const [data, total] = await AppDataSource.manager.getRepository(RuleEntity).findAndCount({where: {site: {id: siteId}}});

  res.send({data, total});
})

app.get("/teams/:teamId/sites", auth, async (req, res) => {
  // create site

  const teamId = Number(req.params.teamId);
  const [data, total] = await AppDataSource.manager.getRepository(Site).findAndCount({where: {
    team: {
      id: teamId
    }
  }
});

  res.send({ data, total });
})

app.get("/teams", auth, async (req, res) => {
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

app.get("/teams/:teamId", auth, async (req, res) => {
  const team = await AppDataSource.manager.getRepository(Team).findOne({
    where: {
      id: Number(req.params.teamId)
    }
  });

  res.send(team);
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