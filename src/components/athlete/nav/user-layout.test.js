const rewire = require("rewire")
const user_layout = rewire("./user-layout")
const GuestLayout = user_layout.__get__("GuestLayout")
// @ponicode
describe("goBack", () => {
    let inst

    beforeEach(() => {
        inst = new GuestLayout()
    })

    test("0", () => {
        let callFunction = () => {
            inst.goBack()
        }
    
        expect(callFunction).not.toThrow()
    })
})
