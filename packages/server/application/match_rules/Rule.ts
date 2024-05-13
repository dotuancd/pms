import { ResponseStrategy } from "../strategies/ResponseStrategy"
import { ForwardRequestStrategy } from "../strategies/ForwardRequestStrategy"
import { RuleMatcher } from "./RuleMatcher"
import { Request } from "express"
import { pathToRegexp } from "path-to-regexp"

type Method = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "PATCH" | "DELETE" | string

export class Rule {

    static all(strategy: ResponseStrategy): Rule {
        return new Rule(["*"], ["/"], null, strategy)
    }

    public get patterns (): RegExp[] {
        return this.routes.map(r => pathToRegexp(r))
    }

    constructor(
        public methods: Method[] = ["*"],
        public routes: string[],
        public header: string | null = null,
        public strategy: ForwardRequestStrategy = new ForwardRequestStrategy()
    ) {}

    isMatch(req: Request): boolean {
        return new RuleMatcher().isMatch(this, req)
    }
}