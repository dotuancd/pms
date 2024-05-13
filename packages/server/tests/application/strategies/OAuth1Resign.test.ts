
import { getTargetUrl } from '../../../application/shared';
import { OAuth1Resign } from '../../../application/strategies/OAuth1Resign';
import { Request } from 'express';

describe('OAuth1Resign', () => {
    it('should resign url', () => {
        const originalUrl = '/p/x/https://ads-api.twitter.com/12/accounts?sort_by=created_at-desc&oauth_consumer_key=foo&oauth_token=baz&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1714710427&oauth_nonce=baz&oauth_version=1.0&oauth_signature=hRyEOwdUZo7L%2BHMhO85YPF62alA%3D'

        const url = getTargetUrl({originalUrl} as Request);

        const toSignUrl = new URL(url.toString());

        const signer = new OAuth1Resign(
            'foo',
            'alpha',
            'baz',
            'beta'
        )

        const signedUrl = signer.resign(toSignUrl, 'GET')

        const want = new URL('https://ads-api.twitter.com/12/accounts?sort_by=created_at-desc&oauth_consumer_key=foo&oauth_token=baz&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1714710427&oauth_nonce=baz&oauth_version=1.0&oauth_signature=B0vfi0jz%2BioI4FUiGnDge%2F2bssU%3D')

        expect(signedUrl).toEqual(want);
    });
})