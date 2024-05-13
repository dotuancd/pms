
import { Request } from 'express'
import { Rule } from './Rule'
import { pathToRegexp } from 'path-to-regexp'
import { getTargetUrl } from '../shared';

export class RuleMatcher {
 
    private isMethodMatched(rule: Rule, request: Request) {
        return rule.methods.includes("*") || rule.methods.includes(request.method.toUpperCase())
    }

    private isPatternsMatched(rule: Rule, request: Request) {
        const targetUrl = getTargetUrl(request);
        return !rule.routes || rule.patterns.some((p) => {
            return pathToRegexp(p).test(targetUrl.pathname)
        })
        // return rule.patterns.length == 0 || rule.patterns.some((p) => {
        //     return new RegExp(p).test(request.url)
        // })
    }

    private isHeaderMatched(rule: Rule, request: Request) {
        return !rule.header || Object.keys(request.headers).some((header) => {
            return `${header}: ${request.header(header)}`.toLowerCase() == rule.header?.toLocaleLowerCase()
        })
    }

    isMatch(rule: Rule, request: Request): boolean {
        return this.isMethodMatched(rule, request)
         && this.isPatternsMatched(rule, request)
        && this.isHeaderMatched(rule, request)
    }
}