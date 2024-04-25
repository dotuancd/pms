import { CountBasedResponseStrategy } from "../../../application/strategies/CountBasedResponseStrategy";
import { ResponseStrategy } from "../../../application/strategies/ResponseStrategy";
import { Request, Response } from "express";

describe("CountBasedResponseStrategy", () => {
    it("should return a response based on the count", () => {
        // Arrange
        const conditions: [number, ResponseStrategy][] = [
            [2, { build: jest.fn() }],
            [3, { build: jest.fn() }],
            [4, { build: jest.fn() }],
        ];
        const fallback = { build: jest.fn() };
        const strategy = new CountBasedResponseStrategy(new Map(), fallback, conditions);
        const req = {url: "1"} as Request;
        const res = {} as Response;
        
        // Act
        strategy.build(req, res);
        
        // Assert
        expect(fallback.build).toHaveBeenCalled();
    })
})