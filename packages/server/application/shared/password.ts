
import { pbkdf2Sync, pbkdf2, randomBytes, timingSafeEqual } from 'crypto'

const algo = 'sha256';
const keylen = 64;
const iterations = 100_000;

export class Password {
    public static make(password: string): string {
        const salt = randomBytes(16);
        const hash = pbkdf2Sync(password, salt, iterations, keylen, algo);
        return salt.toString('hex') + ':' + hash.toString('hex');
    }

    public static verify(password: string, hash: string): boolean {
        const [salt, key] = hash.split(':');
        const hashed = Buffer.from(key, 'hex');
        const hashBuffer = pbkdf2Sync(password, Buffer.from(salt, 'hex'), iterations, keylen, algo);
        return timingSafeEqual(hashed, hashBuffer);
    }
}