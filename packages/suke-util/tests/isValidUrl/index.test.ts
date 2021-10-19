import { isValidUrl } from "@suke/suke-util/src"

describe("testing isValidUrl util function", () => {
    test("should return true for valid url's" , () => {
        expect(isValidUrl("yeno.dev")).toBeTruthy()
        expect(isValidUrl("sync.yeno.dev")).toBeTruthy()
        expect(isValidUrl("https://sync.yeno.dev")).toBeTruthy()
        expect(isValidUrl("http://sync.yeno.dev")).toBeTruthy()
    })

    test("should return false for invalid url's" , () => {
        expect(isValidUrl("ftp://iseeyoukhai@yeno.dev")).toBeFalsy()
        expect(isValidUrl("yeno.d")).toBeFalsy()
        expect(isValidUrl("http//yeno.d")).toBeFalsy()
        expect(isValidUrl("dab://yeno.d")).toBeFalsy()
        expect(isValidUrl("yeno://khai93.com")).toBeFalsy()
    })
})