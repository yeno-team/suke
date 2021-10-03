import "reflect-metadata";
import axios from "axios";
import { Container } from "typedi";
import KickAssAnime , { KickAssAnimeLink } from "..";
import { mockBadEpisodeResponses , mockGoodEpisodeResponses } from "./mocks/mockEpisodesResponses";
import { mockAnimeSearchResponses } from "./mocks/mockAnimeSearchResponses";

jest.mock("axios")
afterEach(() => jest.resetAllMocks())

const mockAxios = axios as jest.Mocked<typeof axios>
const link = new KickAssAnimeLink("https://www2.kickassanime.ro/anime/khai-69420")

describe("KickAssAnime class" , () => {
    const kickAssAnime = Container.get(KickAssAnime)

    describe("getEpisodes()" , () => {        
        test("should return an array of anime episodes" , async () => {
            for(const mockResponse of mockGoodEpisodeResponses) {
                mockAxios.get.mockResolvedValue({ data : mockResponse })
                expect(Array.isArray(await kickAssAnime.getEpisodes(link))).toBeTruthy()
            }
        })

        test("should not return an array of anime episodes" , async () => {
            for(const mockResponse of mockBadEpisodeResponses) {
                mockAxios.get.mockResolvedValueOnce({ data : mockResponse })
                expect(await kickAssAnime.getEpisodes(link)).toBe(null)
            }
        })
    })

    describe("searchForAnime()" , () => {
        test("should fetch an array of animes that matches the keyword", async() => {
            for(const mockResponse of mockAnimeSearchResponses) {
                mockAxios.post.mockResolvedValue({ data : mockResponse })
                expect(Array.isArray(await kickAssAnime.searchForAnime("test"))).toBeTruthy()
            }
        })

        test("should return null when searching for animes" , async () => {
            mockAxios.post.mockResolvedValue({ data : null })
            expect(await kickAssAnime.searchForAnime("test")).toBe(null)
        })
    })
})