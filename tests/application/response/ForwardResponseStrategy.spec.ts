import { ForwardResponseStrategy } from "../../../application/response/ForwardResponseStrategy"
import { IncomingMessage, ServerResponse } from 'http'
import { Socket } from 'net'

desribe('ForwardResponseStrategy', () => {

    it('should create a response', () => {
        const request = new IncomingMessage(
            new Socket()
        )

        request.url = 'http://localhost:3000'

        const response = new ForwardResponseStrategy().buildResponse(request)

        expect(response).toBeInstanceOf(ServerResponse)
    })
})