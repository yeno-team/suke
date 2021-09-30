import { KickAssAnimeLink } from "..";

function matcher(url : string) : jest.JestMatchers<() => KickAssAnimeLink> {
    return expect(() => new KickAssAnimeLink(url))
}
 
function shouldThrowValidationError(matcher : jest.JestMatchers<() => KickAssAnimeLink>) {
    matcher.toThrowError()
}

function shouldNotThrowValidationError(matcher : jest.JestMatchers<() => KickAssAnimeLink>) {
    matcher.not.toThrowError()
}

describe("KickAssAnimeLink class" , () => {
    test("should create an instance of KickAssAnimeLink" , () => {
        expect(matcher("https://www2.kickassanime.ro/anime/the-idaten-deities-know-only-peace-400070/")).toBeDefined()
    })

    test("should throw an error when the url is not a kickassanime link" , () => {
        shouldThrowValidationError(matcher("https://google.com"))
        shouldThrowValidationError(matcher("https://bing.com"))
        shouldThrowValidationError(matcher("https://www2.kickassanime.ro/anime/the-idaten-deities-know-only-peace-400070/episode-11-648949"))
        shouldThrowValidationError(matcher("https://www2.kickassanime.ro/anime/heaven-officials-blessing-jp-ver-225593/episode-09-152842"))
    })

    test("should not throw an error when the url is a kickassanime link." , () => {
        shouldNotThrowValidationError(matcher("https://www2.kickassanime.ro/anime/fena-pirate-princess-733450"))
        shouldNotThrowValidationError(matcher("https://www2.kickassanime.ro/anime/gotoubun-no-hanayome-dub-256871"))
        shouldNotThrowValidationError(matcher("https://www2.kickassanime.ro/anime/cyborg-009-legend-of-the-super-galaxy-dub-571848"))
        shouldNotThrowValidationError(matcher("https://www2.kickassanime.ro/anime/mairimashita-iruma-kun-2nd-season-dub-864451"))
    })
})