
export type StaticOptions = {
    status: number;
    body: string | null;
    headers: {key: string, value: string}[];
}

export type StrategyTypes = "static" | "forward" | "count" | "rates";

export type CountOptions = {
    value: number;
    operator: ">" | "<" | ">=" | "<=" | "==" | "!="
    strategy: Strategy
}

export type RateOption = {
    rate: number;
    strategy: Strategy;
}

export type RatesOptions = {
    rates: RateOption[]
}

export type StaticStrategy = {
    type: "static";
    options: StaticOptions;
}

export type ForwardStrategy = {
    type: "forward";
}

export type CountStrategy = {
    type: "count";
    options: {
        senarios: CountOptions[]
        fallback: Strategy,
    };
}

export type RatesStrategy = {
    type: "rates";
    options: RatesOptions;
}

export type Strategy = RatesStrategy | CountStrategy | ForwardStrategy | StaticStrategy;