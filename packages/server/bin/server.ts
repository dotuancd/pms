
import express from "express";
import { ForwardRequestStrategy } from "../application/strategies/ForwardRequestStrategy";
import { Rule } from "../application/match_rules/Rule";
import { AppDataSource } from "../src/data-source";
import { Site } from "../src/entity/Site";
import { Rule as RuleEntity } from "../src/entity/Rule";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { manager as strategyFactory } from "../application/strategies/ResponseStrategyFactory";

process.loadEnvFile();
import auth from "../adapters/primary/middlewares/auth";
import TeamRoutes from "../adapters/primary/routes/TeamRoutes";
import AuthRoutes from "../adapters/primary/routes/AuthRoutes";
import SiteRoutes from "../adapters/primary/routes/SiteRoutes";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))
// app.use(express.json());
// app.use(express.raw())
app.set("x-powered-by", false);
app.use(morgan("short"));
app.use(cookieParser())

function loadSite() {
  return async (req, res, next) => {
    const site = await AppDataSource.getRepository(Site)
    .createQueryBuilder()
    .addSelect("Site.resigner")
    .whereInIds(req.params.siteKey)
    .getOne();

    if (!site) {
      return res.status(404).send("Site not found");
    }

    site.rules = await AppDataSource.getRepository(Site).createQueryBuilder()
    .relation(Site, "rules")
    .of(site)
    .loadMany();

    req.site = site;
    return next();
  }
}

function logRequest() {
  return (req, res, next) => {
    console.log(req.url);

    next();
  }
}

const port = 8080;

const backendRoutes = express.Router();
backendRoutes.use(express.json());
backendRoutes.get("/", (req, res) => {
  res.send("Hello World!");
});

backendRoutes.use("/teams", TeamRoutes)
backendRoutes.use("/sites", SiteRoutes)
backendRoutes.use(AuthRoutes)

backendRoutes.get("/rules/:ruleId", auth, async (req, res) => {
  // create rule
  const siteId = Number(req.params.ruleId);
  const rule = await AppDataSource.manager.getRepository(RuleEntity).findOne({where: {id: siteId}});
  res.send(rule);
})

backendRoutes.delete("/rules/:ruleId", auth, async (req, res) => {
  // create rule
  const siteId = Number(req.params.ruleId);
  await AppDataSource.manager.getRepository(RuleEntity).delete(siteId);
  res.status(204).send();
})

app.use(backendRoutes);

app.all("/p/:siteKey/*", loadSite(), logRequest(), async (req, res) => {
  // @ts-ignore
  const site = req.site as Site;

  const rules = site.rules.map((rule) => {

    const siteOptions = site.resigner ? {resigner: site.resigner} : {};

    return new Rule(
      rule.methods,
      rule.routes,
      null,
      strategyFactory.create(rule.strategy.type, {...siteOptions, ...rule.strategy.options}),
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