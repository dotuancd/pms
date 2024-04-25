import { Request, Response } from "express";
import { ResponseStrategy } from "./ResponseStrategy";

export class StaticResponseStrategy implements ResponseStrategy {
    constructor(
        public readonly statusCode: number,
        public readonly body: string,
        public readonly headers: { [key: string]: string } = {}
    ) {}

    async build(req: Request, res: Response): Promise<Response> {
        for (const key in this.headers) {
            res.setHeader(key, this.headers[key])
        }

        return res
            .status(this.statusCode)
            .send(this.body)
    }
}