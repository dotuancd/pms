import { RatesResponseStrategy } from "../../../application/strategies/RatesResponseStrategy";
import { ResponseStrategy } from "../../../application/strategies/ResponseStrategy";
import { Request, Response } from "express";
import { manager } from "../../../application/strategies/ResponseStrategyFactory";
import { ForwardRequestStrategy } from "../../../application/strategies/ForwardRequestStrategy";
import { StaticResponseStrategy } from "../../../application/strategies/StaticResponseStrategy";
import { CountBasedResponseStrategy } from "../../../application/strategies/CountBasedResponseStrategy";

describe("ResponseStrategyFactory", () => {

    it('should return a forward response strategy', () => {
        const strategy = manager.create("forward", {})

        expect(strategy).toBeInstanceOf(ForwardRequestStrategy)
    })

    it("shoudld return static response strategy", () => {
        const strategy = manager.create("static", {
            response: {
                status: 200,
                body: '{ "message": "Hello" }',
                headers: {
                    'Content-Type': "application/json"
                }
            }
        })

        expect(strategy).toEqual(
            new StaticResponseStrategy(200, '{ "message": "Hello" }', {
                'Content-Type': "application/json"
            })
        )
    })
    
    it("should return a response strategy based on the rate", () => {
        const strategy = manager.create("rates", {
            rates: [
                {
                    rate: 10,
                    strategy: { 
                        type: "static",
                        response: {
                            status: 200,
                            body: '{ "message": "Hello" }',
                            headers: {"Content-Type": "application/json"}
                        }
                    }
                },
                {
                    rate: 20,
                    strategy: { 
                        type: "static",
                        response: {
                            status: 401,
                            body: '{ "message": "unauthorized" }',
                            headers: {"Content-Type": "application/json"}
                        }
                    }
                },
                {
                    rate: 70,
                    strategy: { 
                        type: "forward"
                    }
                },
            ]
        })

        expect(strategy).toEqual(
            new RatesResponseStrategy([
                [10, new StaticResponseStrategy(200, '{ "message": "Hello" }', {"Content-Type": "application/json"})],
                [20, new StaticResponseStrategy(401, '{ "message": "unauthorized" }', {"Content-Type": "application/json"})],
                [70, new ForwardRequestStrategy()]
            ])
        )
    })

    it('should return a count based response strategy', () => {
        const strategy = manager.create("count", {
            conditions: [
                {
                    operator: "<=",
                    value: 2,
                    strategy: { type: "static", response: { status: 200, body: "Hello", headers: {} } }
                },
                {
                    operator: "<=",
                    value: 3,
                    strategy: { type: "static", response: { status: 401, body: "unauthorized", headers: {} } }
                },
                {
                    operator: ">=",
                    value: 5,
                    strategy: { type: "forward" }
                }
            ],
            fallback: { type: "forward" }
        })

        expect(strategy).toEqual(
            new CountBasedResponseStrategy(
                new Map(),
                new ForwardRequestStrategy(),
                [
                    ["<=", 2, new StaticResponseStrategy(200, "Hello", {})],
                    ["<=", 3, new StaticResponseStrategy(401, "unauthorized", {})],
                    [">=", 5, new ForwardRequestStrategy()]
                ]
            )
        )
    })
});