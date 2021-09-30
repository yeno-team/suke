import axios from "axios";
import KickAssAnime , { KickAssAnimeLink } from "..";

jest.mock("axios")
afterEach(() => jest.clearAllMocks())

const mockCorrectResponses = [
    '[{"epnum":"Episode 13","name":null,"slug":"\\/anime\\/higehiro-after-being-rejected-i-shaved-and-took-in-a-high-school-runaway-763634\\/episode-13-840302","createddate":"2021-06-28 11:07:29","num":"13"}]',
    '[{"epnum":"Episode 10","name":"Witch of the Deep Ocean V.S. Raikiri","slug":"\\/anime\\/rakudai-kishi-no-cavalry-dub-878414\\/episode-10-375049","createddate":"2019-08-21 09:08:12","num":"10"},{"epnum":"Episode 09","name":"Princess\' Vacation","slug":"\\/anime\\/rakudai-kishi-no-cavalry-dub-878414\\/episode-09-808407","createddate":"2019-08-21 09:08:13","num":"9"}]'
]

const mockIncorrectResponses = [
    "<h1> Hello this is an incorrect <b> Hello </b>",
    "<div class='center' style='font-size:16px'> This is a div </div"
]

const mockAxios = axios as jest.Mocked<typeof axios>

describe("KickAssAnime class" , () => {
    describe("getEpisodes()" , () => {
        const kickAssAnime = new KickAssAnime()
        
        test("should return an array of anime episodes" , async () => {
            for(const mockResponse of mockCorrectResponses) {
                mockAxios.get.mockResolvedValue({ data : mockResponse })

                expect(Array.isArray(await kickAssAnime.getEpisodes(new KickAssAnimeLink("https://www2.kickassanime.ro/anime/khai-763634")))).toBeTruthy()
            }
        })

        test("should not return an array of anime episodes" , async () => {
            for(const mockResponse of mockIncorrectResponses) {
                mockAxios.get.mockResolvedValueOnce({ data : mockResponse })

                expect(await kickAssAnime.getEpisodes(new KickAssAnimeLink("https://www2.kickassanime.ro/anime/khai-763634"))).toBe(null)
            }
        })
    })
})