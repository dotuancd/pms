
import e, { Request, Response } from 'express';
import { ResponseStrategy } from './ResponseStrategy';
import { getTargetUrl } from '../shared';
import { Resign } from './Resign';
import axios, { AxiosResponse } from 'axios';

export class ForwardRequestStrategy implements ResponseStrategy {

    public constructor(private readonly resigner?: Resign) {}

    async build(req: Request, res: Response): Promise<Response> {
        const url = getTargetUrl(req);

        const headers = req.headers as Record<string, string>;

        // Remove content-length header to prevent mismatch between actual body and content-length
        delete headers['content-length'];
        delete headers['host'];

        const targetUrl = this.resigner ? this.resigner.resign(url, req.method) : url;

        try {
            const body = ["HEAD", "GET"].includes(req.method.toUpperCase()) ? {} : {data: req.body}

            let forwardedResponse: AxiosResponse<any, any>;
            
            try {
                forwardedResponse = await axios(targetUrl.toString(), {
                    method: req.method,
                    headers,
                    ...body,
                    responseType: 'stream',
                })
            } catch (e) {
                // Axios throws an error if the response status is not 2xx. But we still want to forward the response
                if (e.response) {
                    forwardedResponse = e.response;
                } else {
                    throw e;
                }
            }
            
            const blacklistHeaders: string[] = [
                // We rewrite encoding then if we forward heade. Client might not decode the encoding correctly
                'content-encoding',
                'content-length'
            ];
        
            const responseHeaders = Object.keys(forwardedResponse.headers)
            .filter(key => {
                return ! blacklistHeaders.includes(key.toLowerCase())
            })
            .reduce((acc, key) => {
                acc[key] = forwardedResponse.headers[key];
                return acc;
            }, {} as Record<string, string>);

            // Forward the response
            forwardedResponse.data.pipe(res);
            return res.status(forwardedResponse.status)
            .header(responseHeaders)
        } catch (error) {
            console.error('Error forwarding request:', error);
            return res.status(500).send(`Error forwarding request: ${error}`);
        }
    }
}