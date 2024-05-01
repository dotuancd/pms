
import {Request} from "express"
import { RuleMatcher } from "../../application/match_rules/RuleMatcher"
import { Rule } from "../../application/match_rules/Rule"
import { ForwardRequestStrategy } from "../../application/strategies/ForwardRequestStrategy"

describe('MatchRule', () => {

    it('Should match by all', () => {
        const request = {
            originalUrl: "/p/FfuIRQ0TuOWNKakN8V1ku/http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = Rule.all(new ForwardRequestStrategy())

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it('Should match by methods', () => {
        const request = {
            originalUrl: "/p/W52smpcfX-YvQyj1eHRnc/http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new Rule(
            ["POST"],
            ["/"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it('should not match by methods', () => {
        const request = {
            url: "http://localhost:8080/post",
            method: "GET"
        } as Request

        const matcher = new Rule(
            ["POST"],
            ["/"],
        )

        expect(matcher.isMatch(request)).toBeFalsy
    })

    it("Should match by path", () => {
        const request = {
            originalUrl: "/p/x/http://localhost:8080/post"
        } as Request

        const matcher = new Rule(
            ["*"],
            ["/post"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it("Should not match by path", () => {
        const request = {
            originalUrl: "/p/x/http://localhost:8080/post"
        } as Request

        const matcher = new Rule(
            ["*"],
            ["/get"],
        )

        expect(matcher.isMatch(request)).toBeFalsy
    })

    it("Should match by path and method", () => {
        const request = {
            originalUrl: "/p/x/http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new Rule(
            ["POST"],
            ["/post"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it("Should not match by path and method", () => {
        const request = {
            originalUrl: "/p/x/http://localhost:8080/post",
            method: "POST",
        } as Request

        const rule = new Rule(
            ["POST"],
            ["/get"],
        )

        expect(rule.isMatch(request)).toBeFalsy
    })
})