
import * as jose from 'jose'

export class Jwt {

    static secret = jose.base64url.decode(process.env.JWT_SECRET)

    static expiresIn = '1d'

    static issuer = 'psm'

    static audience = 'psm-client'

    static algorithm = 'HS256'

    static protectedHeader = { alg: 'dir', enc: 'A128CBC-HS256' }

    static async encode(payload: any) {
        return await new jose.EncryptJWT(payload)
        .setIssuer(Jwt.issuer)
        .setAudience(Jwt.audience)
        .setExpirationTime(Jwt.expiresIn)
        .setProtectedHeader(Jwt.protectedHeader)
        .setIssuedAt()
        .encrypt(Jwt.secret)
    }

    static async decode(token: string) {
        const { payload } = await jose.jwtDecrypt(token, Jwt.secret, {
            issuer: Jwt.issuer,
            audience: Jwt.audience,
        })

        return payload
    }
}