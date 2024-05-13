import { Method, Resign } from "./Resign";
import oauth1 from 'node-oauth1'
const sign = oauth1.SignatureMethod.sign;

export class OAuth1Resign implements Resign {

    constructor(
        private readonly consumerKey: string,
        private readonly consumerSecret: string,
        private readonly accessToken: string,
        private readonly tokenSecret: string
    ) {}

    resign(url: URL, method: Method): URL {
        const oauth1Parameters = [
            'oauth_consumer_key',
            'oauth_token',
            'oauth_signature_method',
            'oauth_timestamp',
            'oauth_nonce',
            'oauth_version',
            'oauth_signature'
        ]

        // Copy the URL to avoid modifying the original
        const toSignUrl = new URL(url.toString());

        const oauth_signature_method = toSignUrl.searchParams.get('oauth_signature_method')
        const oauth_consumer_key = this.consumerKey
        const oauth_token = this.accessToken
        const oauth_nonce = toSignUrl.searchParams.get('oauth_nonce')
        const oauth_timestamp = toSignUrl.searchParams.get('oauth_timestamp')
        const oauth_version = toSignUrl.searchParams.get('oauth_version')

        // Remove the oauth parameters from the URL
        oauth1Parameters.forEach(header => {
            toSignUrl.searchParams.delete(header)
        })

        const message = {
            action: toSignUrl.toString(),
            method: method,
            parameters: {
                oauth_signature_method,
                oauth_consumer_key,
                oauth_token,
                oauth_nonce,
                oauth_timestamp,
                oauth_version
            }
        }

        const accessor = {
            consumerSecret: this.consumerSecret,
            tokenSecret: this.tokenSecret
        }

        // The signature will be added to the message.parameters object
        const _ = sign(message, accessor)

        const signedUrl = new URL(toSignUrl.toString())

        Object.keys(message.parameters).forEach(key => {
            signedUrl.searchParams.append(key, message.parameters[key])
        })

        return signedUrl;
    }
}