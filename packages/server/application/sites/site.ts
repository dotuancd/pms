import { Request, Response } from "express";
import { ResponseStrategy } from "../strategies/ResponseStrategy";


export class Site {
    constructor(
        public readonly key: string,
        public name: string,
        public url: string,
        public readonly forward: boolean = false
    ) {}

    match(request: Request): ResponseStrategy {
        throw new Error('Not implemented');

        // const errorStragegy = this.getErrorStrategy();

        // if (this.forward) {
        //     return new ForwardResponseStrategy();
        // }

        // return new StaticResponseStrategy(this.name);
    }
}