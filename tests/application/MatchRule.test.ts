
import {Request} from "express"
import { RuleMatcher } from "../../application/match_rules/RuleMatcher"

describe('MatchRule', () => {

    it('Should match by all', () => {
        const request = {
            url: "http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new RuleMatcher(
            ["*"],
            [".*"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it('Should match by methods', () => {
        const request = {
            url: "http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new RuleMatcher(
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

        const matcher = new RuleMatcher(
            ["POST"],
            ["/"],
        )

        expect(matcher.isMatch(request)).toBeFalsy
    })

    it("Should match by path", () => {
        const request = {
            url: "http://localhost:8080/post"
        } as Request

        const matcher = new RuleMatcher(
            ["*"],
            ["/post"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it("Should not match by path", () => {
        const request = {
            url: "http://localhost:8080/post"
        } as Request

        const matcher = new RuleMatcher(
            ["*"],
            ["/get"],
        )

        expect(matcher.isMatch(request)).toBeFalsy
    })

    it("Should match by path and method", () => {
        const request = {
            url: "http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new RuleMatcher(
            ["POST"],
            ["/post"],
        )

        expect(matcher.isMatch(request)).toBeTruthy
    })

    it("Should not match by path and method", () => {
        const request = {
            url: "http://localhost:8080/post",
            method: "POST"
        } as Request

        const matcher = new RuleMatcher(
            ["POST"],
            ["/get"],
        )

        expect(matcher.isMatch(request)).toBeFalsy
    })
})