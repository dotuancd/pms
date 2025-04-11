import { Request, Response } from 'express';
import { ForwardRequestStrategy } from '../../../application/strategies/ForwardRequestStrategy';
import { Resign } from '../../../application/strategies/Resign';
import axios from 'axios';
import { getTargetUrl } from '../../../application/shared';

jest.mock('axios');
jest.mock('../../../application/shared');

describe('ForwardRequestStrategy', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let resigner: Resign;
    let strategy: ForwardRequestStrategy;

    beforeEach(() => {
        req = {
            method: 'GET',
            headers: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            header: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        resigner = {
            resign: jest.fn().mockReturnValue('http://resigned-url.com'),
        };
        strategy = new ForwardRequestStrategy(resigner);
    });

    it('should forward the request and return the response', async () => {
        (getTargetUrl as jest.Mock).mockReturnValue('http://target-url.com');
        (axios as unknown as jest.Mock).mockResolvedValue({
            status: 200,
            headers: { 'content-type': 'application/json' },
            data: { pipe: jest.fn() },
        });

        await strategy.build(req as Request, res as Response);

        expect(getTargetUrl).toHaveBeenCalledWith(req);
        expect(resigner.resign).toHaveBeenCalledWith('http://target-url.com', 'GET');
        expect(axios).toHaveBeenCalledWith('http://resigned-url.com', expect.objectContaining({
            method: 'GET',
            headers: req.headers,
            responseType: 'stream',
        }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.header).toHaveBeenCalledWith({ 'content-type': 'application/json' });
    });

    it('should handle errors and return a 500 status', async () => {
        (getTargetUrl as jest.Mock).mockReturnValue('http://target-url.com');
        (axios as unknown as jest.Mock).mockRejectedValue(new Error('Network error'));

        await strategy.build(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error forwarding request: Error: Network error');
    });
});