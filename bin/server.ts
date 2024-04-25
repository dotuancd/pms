import express from "express";
import { ForwardRequestStrategy } from "../application/strategies/ForwardRequestStrategy";
import { RatesResponseStrategy } from "../application/strategies/RatesResponseStrategy";
import { CountBasedResponseStrategy } from "../application/strategies/CountBasedResponseStrategy";
import { StaticResponseStrategy } from "../application/strategies/StaticResponseStrategy";
import { Rule } from "../application/match_rules/Rule";
import { RuleMatcher } from "../application/match_rules/RuleMatcher";

const app = express();

const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const counterStorage = new Map<string, number>();

app.all("/:site/*", (req, res) => {
  const site = req.params.site;

  const rules = [
    new Rule(
      ["GET"],
      ["/get"],
      null,
      new RatesResponseStrategy(
        [
          [10, new StaticResponseStrategy(200, "10% error")],
          [20, new StaticResponseStrategy(200, "20% error")],
          [30, new StaticResponseStrategy(200, "30% error")],
          [40, new ForwardRequestStrategy],
        ]
      )
    ),
    new Rule(
      ["GET"],
      ["/ip"],
      null,
      new CountBasedResponseStrategy(
        counterStorage, 
        new ForwardRequestStrategy(),
        [
          ["<=", 2, new StaticResponseStrategy(200, "127.0.0.1")],
          ["<=", 3, new StaticResponseStrategy(200, "192.168.1.1")],
          ["<", 5, new StaticResponseStrategy(200, "10.0.0.0")],
        ]
      )
    ),
    new Rule(
      ["POST"],
      ["/post"],
      null,
      new StaticResponseStrategy(200, "POST response")
    ),
    Rule.all(new ForwardRequestStrategy())
  ];

  const matchRule = rules.find((rule) => rule.isMatch(req));

  const strategy = matchRule?.strategy || new ForwardRequestStrategy();

  return strategy.build(req, res);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});