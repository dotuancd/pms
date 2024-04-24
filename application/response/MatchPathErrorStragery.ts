import { Site } from "../sites/site";
import { ErrorStrategy } from "./ErrorStrategy";
import { Request, Response } from "express";

export class MatchPathErrorStrategy implements ErrorStrategy {
    constructor(
        // Regex pattern to match
        public readonly paths: string[],
    ) {}

    get patterns() {
        return this.paths.map((path) => new RegExp(path))
    };

    async shouldReturnError(req: Request) {
        return this.patterns.find((path) => {
            return path.test(req.url);
        }) !== undefined;
    }

    async buildErrorResponse(site: Site, req: Request, res: Response) {
        return res.status(429).send(`Too many errors for site ${site.key}`);
    }
}