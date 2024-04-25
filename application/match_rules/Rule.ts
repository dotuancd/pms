import { ResponseStrategy } from "../strategies/ResponseStrategy"
import { ForwardRequestStrategy } from "../strategies/ForwardRequestStrategy"
import { RuleMatcher } from "./RuleMatcher"
import { Request } from "express"

type Method = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "PATCH" | "DELETE" | string

export class Rule {
    constructor(
        public methods: Method[] = ["*"],
        public patterns: string[],
        public header: string | null = null,
        public strategy: ForwardRequestStrategy = new ForwardRequestStrategy()
    ) {}

    isMatch(req: Request): boolean {
        return new RuleMatcher().isMatch(this, req)
    }
}