import "reflect-metadata";
import axios from "axios";
import { Container } from "typedi";
import KickAssAnime , { KickAssAnimeLink } from "..";
import { mockBadEpisodeResponses , mockGoodEpisodeResponses } from "./mocks/mockEpisodesResponses"

jest.mock("axios")
afterEach(() => jest.resetAllMocks())

const mockAxios = axios as jest.Mocked<typeof axios>

describe("KickAssAnime class" , () => {
    const kickAssAnime = Container.get(KickAssAnime)

    describe("getEpisodes()" , () => {        
        test("should return an array of anime episodes" , async () => {
            for(const mockResponse of mockGoodEpisodeResponses) {
                mockAxios.get.mockResolvedValue({ data : mockResponse })
                
                expect(Array.isArray(await kickAssAnime.getEpisodes(new KickAssAnimeLink("https://www2.kickassanime.ro/anime/khai-69420")))).toBeTruthy()
            }
        })

        test("should not return an array of anime episodes" , async () => {
            for(const mockResponse of mockBadEpisodeResponses) {
                mockAxios.get.mockResolvedValueOnce({ data : mockResponse })

                expect(await kickAssAnime.getEpisodes(new KickAssAnimeLink("https://www2.kickassanime.ro/anime/khai-763634"))).toBe(null)
            }
        })
    })

    // describe("searchForAnime()" , () => {
    //     test("should fetch an array of animes that matches the keyword" , async () => {
            
    //     })
    // })
})