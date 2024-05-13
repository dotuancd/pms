import nanoid from "../../../application/shared/nanoid"

describe('Nano id', () => {
    test('Should generate based on length', () => {
        const id = nanoid(21)

        console.log({id});
        expect(id).toHaveLength(21)
    })
})
