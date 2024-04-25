
import { Request } from 'express'

type Method = "GET" | "POST" | "OPTIONS" | "HEAD" | "PUT" | "PATCH" | "DELETE" | string

export class RuleMatcher {
    constructor(
        public methods: Method[] = ["*"],
        public patterns: string[],
        public header?: string) {}

    private isMethodMatched(request: Request) {
        return this.methods.includes("*") || this.methods.includes(request.method.toUpperCase())
    }

    private isPatternsMatched(request: Request) {
        return this.patterns.length == 0 || this.patterns.some((p) => {
            new RegExp(p).test(request.url)
        })
    }

    private isHeaderMatched(request: Request) {
        return !this.header || Object.keys(request.headers).some((header) => {
            return `${header}: ${request.header(header)}`.toLowerCase() == this.header
        })
    }

    isMatch(request: Request): boolean {
        return this.isMethodMatched(request) && this.isPatternsMatched(request) && this.isHeaderMatched(request)
    }
}