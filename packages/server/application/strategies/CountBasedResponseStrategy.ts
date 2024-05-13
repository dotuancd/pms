import { ResponseStrategy } from "./ResponseStrategy";
import { Request, Response } from 'express';
import { Sha1 } from '../shared/sha1';

type Operator = "<" | "<=" | ">" | ">=" | "==" | "!=";

export class CountBasedResponseStrategy {

    constructor(
        private readonly counters: Map<string, number>,
        private readonly fallback: ResponseStrategy,
        private readonly conditions: [Operator, number, ResponseStrategy][],
    ) {}

    private compare(count: number, operator: Operator, threshold: number): boolean {
        switch (operator) {
            case "<": return count < threshold;
            case "<=": return count <= threshold;
            case ">": return count > threshold;
            case ">=": return count >= threshold;
            case "==": return count == threshold;
            case "!=": return count != threshold;
            default: return false;
        }
    }

    async build(req: Request, res: Response): Promise<Response> {
        const key = Sha1.hash(req.url);
        const count = (this.counters.get(key) || 0) + 1;
        this.counters.set(key, count);

        const matched = this.conditions.find(([operator, threshold]) => {
            return this.compare(count, operator, threshold)
        });

        const strategy = matched ? matched[2] : this.fallback;

        return strategy.build(req, res);
    }
}