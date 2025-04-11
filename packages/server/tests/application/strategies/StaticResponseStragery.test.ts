import { StaticResponseStrategy } from "../../../application/strategies/StaticResponseStrategy";
import { Request, Response } from "express";

describe("StaticResponseStrategy", () => {
    it("should set the response status code correctly", async () => {
        // Arrange
        const statusCode = 200;
        const body = "OK";
        const strategy = new StaticResponseStrategy(statusCode, body);
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            setHeader: jest.fn()
        } as unknown as Response;

        // Act
        await strategy.build(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    it("should set the response body correctly", async () => {
        // Arrange
        const statusCode = 200;
        const body = "OK";
        const strategy = new StaticResponseStrategy(statusCode, body);
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            setHeader: jest.fn()
        } as unknown as Response;

        // Act
        await strategy.build(req, res);

        // Assert
        expect(res.send).toHaveBeenCalledWith(body);
    });

    it("should set the response headers correctly", async () => {
        // Arrange
        const statusCode = 200;
        const body = "OK";
        const headers = [{ key: "Content-Type", value: "application/json" }];
        const strategy = new StaticResponseStrategy(statusCode, body, headers);
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            setHeader: jest.fn()
        } as unknown as Response;

        // Act
        await strategy.build(req, res);

        // Assert
        headers.forEach(({ key, value }) => {
            expect(res.setHeader).toHaveBeenCalledWith(key, value);
        });
    });
});