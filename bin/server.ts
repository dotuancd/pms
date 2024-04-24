import express from "express";
import { ForwardResponseStrategy } from "../application/response/ForwardResponseStrategy";
import { ErrorRateErrorStrategy } from "../application/response/RandomErrorStrategy";
import { CountBasedErrorStrategy } from "../application/response/CountBasedErrorStrategy";
import { MatchPathErrorStrategy } from "../application/response/MatchPathErrorStragery";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const counterStorage = new Map<string, number>();

app.all("/:site/*", (req, res) => {
  const site = req.params.site;
  // const path = req.params[0];/\

  console.log(`Site: ${site}`);

  const strategy = new ForwardResponseStrategy(
    new MatchPathErrorStrategy(
      ["/campaigns/12321232"]
    ),
    // new CountBasedErrorStrategy(2, counterStorage),
  );

  return strategy.buildResponse(req, res);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});