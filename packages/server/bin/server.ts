import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import auth from "../adapters/primary/middlewares/auth";
import AuthRoutes from "../adapters/primary/routes/AuthRoutes";
import SiteRoutes from "../adapters/primary/routes/SiteRoutes";
import TeamRoutes from "../adapters/primary/routes/TeamRoutes";
import HistoryRoutes from "../adapters/primary/routes/HistoryRoutes";
import { Rule } from "../application/match_rules/Rule";
import { ForwardRequestStrategy } from "../application/strategies/ForwardRequestStrategy";
import { manager as strategyFactory } from "../application/strategies/ResponseStrategyFactory";
import { AppDataSource } from "../src/data-source";
import { Rule as RuleEntity } from "../src/entity/Rule";
import { Site } from "../src/entity/Site";
import logRequest from "../adapters/primary/middlewares/logRequest";

process.loadEnvFile();

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

const port = 8080;

const backendRoutes = express.Router();
backendRoutes.use(express.json());
backendRoutes.get("/", (req, res) => {
  res.send("Hello World!");
});

backendRoutes.use("/teams", TeamRoutes)
backendRoutes.use("/sites", SiteRoutes)
backendRoutes.use("/history", HistoryRoutes)
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

app.all("/p/:siteKey/*", loadSite(), logRequest, async (req, res) => {
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

  try {
    const matchRule = rules.find((rule) => rule.isMatch(req));

    const strategy = matchRule?.strategy || new ForwardRequestStrategy();

    return strategy.build(req, res);
  } catch (e) {
    console.error(e.message)
    return res.status(500).json({
      "error": e.message,
    })
  }
})

AppDataSource.initialize().then(() => {
  console.log("Database connected");
  app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
  });
});