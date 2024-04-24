import { Sha1 } from "../shared/sha1";
import { Site } from "../sites/site";
import { ErrorStrategy } from "./ErrorStrategy";

import { Request, Response } from "express";

export class CountBasedErrorStrategy implements ErrorStrategy {
    constructor(
        public readonly errorCountBeforeSuccess: number,
        private counterStorage: Map<string, number>
    ) {}

    async shouldReturnError(req: Request) {
        const key = Sha1.hash(req.url);

        if (!this.counterStorage.has(key)) {
            this.counterStorage.set(key, 0);
        }

        const count = this.counterStorage.get(key)! + 1;

        this.counterStorage.set(key, count);

        return count <= this.errorCountBeforeSuccess;
    }

    async buildErrorResponse(site: Site, req: Request, res: Response) {
        return res.status(429).send(`Too many errors for site ${site.key}`);
    }
}