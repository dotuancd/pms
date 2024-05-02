
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
app.use(express.json());
app.set("x-powered-by", false);
app.use(morgan("short"));
app.use(cookieParser())

const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/teams", TeamRoutes)
app.use("/sites", SiteRoutes)
app.use(AuthRoutes)

app.get("/rules/:ruleId", auth, async (req, res) => {
  // create rule
  const siteId = Number(req.params.ruleId);
  const rule = await AppDataSource.manager.getRepository(RuleEntity).findOne({where: {id: siteId}});
  res.send(rule);
})

app.delete("/rules/:ruleId", auth, async (req, res) => {
  // create rule
  const siteId = Number(req.params.ruleId);
  await AppDataSource.manager.getRepository(RuleEntity).delete(siteId);
  res.status(204).send();
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