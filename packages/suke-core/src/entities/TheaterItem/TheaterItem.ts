

export interface FeaturedTheaterItem {
    title: string,
    description: string,
    backgroundImage: string,
    id: number
}

export interface TheaterItem {
    id: number,
    title: string,
    viewerCount: number,
    posterUrl: string,
    episode?: number
}