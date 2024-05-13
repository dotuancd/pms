import { Request, Response } from "express";
import { ResponseStrategy } from "./ResponseStrategy";

export class StaticResponseStrategy implements ResponseStrategy {
    constructor(
        public readonly statusCode: number,
        public readonly body: string,
        public readonly headers: {key: string, value: string}[] = []
    ) {}

    async build(req: Request, res: Response): Promise<Response> {
        this.headers.forEach(({key, value}) => {
            res.setHeader(key, value)
        })

        return res
            .status(this.statusCode)
            .send(this.body)
    }
}