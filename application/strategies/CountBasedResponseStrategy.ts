import { ResponseStrategy } from "./ResponseStrategy";
import { Request, Response } from 'express';
import { Sha1 } from '../shared/sha1';

export class CountBasedResponseStrategy {

    constructor(
        private readonly counters: Map<string, number>,
        private readonly fallback: ResponseStrategy,
        private readonly conditions: [number, ResponseStrategy][],
    ) {}

    async build(req: Request, res: Response): Promise<Response> {
        const key = Sha1.hash(req.url);
        const count = this.counters.get(key) || 0;
        this.counters.set(key, count + 1);

        const [threshold, strategy] = this.conditions.find(([threshold]) => count >= threshold) || [0, this.fallback];

        return strategy.build(req, res);
    }
}