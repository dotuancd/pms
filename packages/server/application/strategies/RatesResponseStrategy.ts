
import { Request, Response } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { randomInt } from 'crypto';

export class RatesResponseStrategy implements ResponseStrategy {
    totalWeight: number;
    sortedRates: [number, ResponseStrategy][];

    constructor(
        private readonly rates: [number, ResponseStrategy][],
        private readonly randomizer?: (total: number) => number
    ) {
        this.totalWeight = this.rates.reduce((acc, [rate]) => acc + rate, 0);
        this.sortedRates = [...this.rates].sort(([a], [b]) => a - b);
    }

    async build(req: Request, res: Response): Promise<Response> {
        
        const random = this.randomizer ? this.randomizer(this.totalWeight) : randomInt(0, this.totalWeight);

        let seek = 0;
        let strategy: ResponseStrategy | null = null;

        for (const [rate, _strategy] of this.sortedRates) {
            seek += rate;

            if (seek >= random) {
                strategy = _strategy;
                break;
            }
            
        }

        if (strategy) {
            return strategy.build(req, res);
        }

        const [_skip, _strategy] = this.sortedRates[randomInt(0, this.rates.length - 1)];
        
        return _strategy.build(req, res);
    }
}