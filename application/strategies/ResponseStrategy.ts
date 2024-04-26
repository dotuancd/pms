import { Request, Response } from "express";
import { RatesResponseStrategy } from "./RatesResponseStrategy";
import { CountBasedResponseStrategy } from "./CountBasedResponseStrategy";
import { StaticResponseStrategy } from "./StaticResponseStrategy";
import { ForwardRequestStrategy } from "./ForwardRequestStrategy";

export interface ResponseStrategy {
    build(req: Request, res: Response): Promise<Response>
}

export class ReponseStrategyFactory {
    
    static parse(strategy: any): ResponseStrategy {
        const { type, options } = strategy

        switch (type) {
            case "RatesResponseStrategy":
                const rates = options.map(([rate, strategy]) => [rate, this.parse(strategy)])
                return new RatesResponseStrategy(rates)
            case "CountBasedResponseStrategy":
                const {fallback, counts} = options
                return new CountBasedResponseStrategy(
                    new Map(),
                    this.parse(fallback),
                    counts.map(([operator, threshold, strategy]) => ([operator, threshold, this.parse(strategy)] as [string, number, ResponseStrategy])),
                )
            case "StaticResponseStrategy":
                const [status, body, header] = options
                return new StaticResponseStrategy(status, body, header)
            case "ForwardRequestStrategy":
                return new ForwardRequestStrategy()
            default:
                throw new Error(`Unknown strategy type: ${type}`)
        }
    }
}