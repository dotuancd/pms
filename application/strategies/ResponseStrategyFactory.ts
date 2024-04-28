import { CountBasedResponseStrategy } from "./CountBasedResponseStrategy";
import { ForwardRequestStrategy } from "./ForwardRequestStrategy";
import { RatesResponseStrategy } from "./RatesResponseStrategy";
import { ResponseStrategy } from "./ResponseStrategy";
import { StaticResponseStrategy } from "./StaticResponseStrategy";


export type ResponseStrategyFactory = (options: any, manager: ResponseStrategyManager) => ResponseStrategy;

class ResponseStrategyManager {
    private strategies: Map<string, ResponseStrategyFactory> = new Map();

    public register(name: string, factory: ResponseStrategyFactory): void {
        this.strategies.set(name, factory);
    }

    public create(name: string, options: any): ResponseStrategy {
        const factory = this.strategies.get(name);
        if (!factory) {
            throw new Error(`Strategy ${name} not found`);
        }
        return factory(options, this);
    }
}

export const manager = new ResponseStrategyManager();

manager.register("rates", (options, manager) => {
    const { rates } = options;
    const strategies = rates.map((rate: any) => {
        const { rate: r, strategy } = rate;
        return [r, manager.create(strategy.type, strategy)]
    })
    return new RatesResponseStrategy(strategies);
});

manager.register("forward", (options, manager) => {
    return new ForwardRequestStrategy();
});

manager.register("static", (options, manager) => {
    const { response } = options;
    const { status, body, headers } = response;
    return new StaticResponseStrategy(status, body, headers);
})

// We share the counters between all the instances of the CountBasedResponseStrategy
const counters = new Map<string, number>();
manager.register("count", (options, manager) => {
    const { conditions: c, fallback } = options;
    const conditions = c.map(({operator, value, strategy}) => {
        return [operator as "<" | "<=" | ">" | ">=" | "==" | "!=", value, manager.create(strategy.type, strategy)] as [string, number, ResponseStrategy];
    })
    return new CountBasedResponseStrategy(counters, manager.create(fallback.type, fallback), conditions);
});