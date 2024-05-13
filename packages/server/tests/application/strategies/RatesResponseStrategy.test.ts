import { RatesResponseStrategy } from "../../../application/strategies/RatesResponseStrategy";
import { ResponseStrategy } from "../../../application/strategies/ResponseStrategy";
import { Request, Response } from "express";

describe("RatesResponseStrategy", () => {
    
    it("should return a response based on the rate", () => {
        // Arrange
        const rates: [number, ResponseStrategy][] = [
            [50, { build: jest.fn() }],
            [20, { build: jest.fn() }],
            [30, { build: jest.fn() }],
        ];
        const strategy = new RatesResponseStrategy(rates, () => 60);
        const req = {} as Request;
        const res = {} as Response;
        
        // Act
        strategy.build(req, res);
        
        // Assert
        expect(rates[0][1].build).toHaveBeenCalled();
    })

    it("should return a response based on the rate", () => {
        // Arrange
        const rates: [number, ResponseStrategy][] = [
            [20, { build: jest.fn() }],
            [30, { build: jest.fn() }],
            [50, { build: jest.fn() }],
        ];
        const strategy = new RatesResponseStrategy(rates, () => 20);
        const req = {} as Request;
        const res = {} as Response;
        
        // Act
        strategy.build(req, res);
        
        // Assert
        expect(rates[0][1].build).toHaveBeenCalled();
    })
});