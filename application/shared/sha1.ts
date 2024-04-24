
import { createHash } from "crypto"

export class Sha1 {
    static hash(input: string): string {
        return createHash('sha1').update(input).digest('hex')
    }
}