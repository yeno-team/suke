import { createConnection, getRepository } from "typeorm";
import config from "../src/config";
import { TheaterCategory, TheaterItemModel } from '@suke/suke-core/src/entities/TheaterItem';
import { TheaterItemScheduleModel } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { Follower, TheaterItemFollower } from "@suke/suke-core/src/entities/Follower";
import { UserModel } from "@suke/suke-core/src/entities/User";
import { UserChannelModel } from "@suke/suke-core/src/entities/UserChannel";
import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { EmailModel } from "@suke/suke-core/src/entities/Email";

/* [
    {
        title: 'Spider-Man: No way home',
        id: 0,
        viewerCount: 523,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
        followers: [],
        category: TheaterCategory.movie,
        schedules: placeholderSchedules,
        featured: true
    },
    {
        title: 'Daredevil Season 8',
        id: 1,
        viewerCount: 83,
        posterUrl: "https://www.themoviedb.org/t/p/original/c4lulIeTZxPh4xqOcUNH5qlZVpx.jpg",
        episode: 4,
        followers: [],
        category: TheaterCategory.tvShow,
        schedules: placeholderSchedules2,
        featured: false
    },
    {
        title: 'One Piece',
        id: 2,
        posterUrl: "https://www.u-buy.jp/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvODFXMDNCa3NFakwuX0FDX1NMMTUwMF8uanBn.jpg",
        viewerCount: 43,
        episode: 1003,
        followers: [],
        category: TheaterCategory.anime,
        schedules: placeholderSchedules,
        featured: false
    },
    {
        title: 'The 100 Season 6',
        id: 3,
        posterUrl: "https://i.ebayimg.com/images/g/KX0AAOSw8RxfZXFO/s-l300.jpg",
        viewerCount: 52,
        episode: 12,
        followers: [],
        category: TheaterCategory.tvShow,
        schedules: placeholderSchedules2,
        featured: false
    },
    {
        title: 'Attack On Titan: Final Season',
        id: 4,
        posterUrl: "https://www.denofgeek.com/wp-content/uploads/2020/09/Attack-on-Titan-Season-4-Poster.jpg?resize=725,1024",
        viewerCount: 109,
        episode: 6,
        followers: [],
        category: TheaterCategory.anime,
        schedules: placeholderSchedules,
        featured: false
    },
    {
        title: 'Uncharted',
        id: 5,
        posterUrl: "https://assets-prd.ignimgs.com/2022/01/13/uncharted-poster-full-1642086040683.jpg",
        viewerCount: 52,
        followers: [],
        category: TheaterCategory.movie,
        schedules: placeholderSchedules2,
        featured: true
    },
    {
        title: 'Sonic The Hedgehog 2',
        id: 6,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BMzExMWVjODMtYjgzOC00ZDljLTgxMTktYWQ0NGNiOTcxNGYxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
        viewerCount: 17,
        followers: [],
        category: TheaterCategory.movie,
        schedules: placeholderSchedules,
        featured: false
    },
]*/

export const testItems = [
    {
        title: 'Spider-Man: No way home',
        id: 0,
        viewerCount: 523,
        posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg",
        followers: [],
        category: TheaterCategory.movie,
        schedules: [],
        featured: true
    }
];

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [
        UserModel, 
        UserChannelModel, 
        Follower, 
        CategoryModel, 
        EmailModel, 
        TheaterItemModel, 
        TheaterItemFollower, 
        TheaterItemScheduleModel 
    ],
    synchronize: true,
}).then(async () => {
    console.log("Connected to DB");

    for (const item of testItems) {
        const itemModel = new TheaterItemModel();
        itemModel.category = item.category;
        itemModel.title = item.title;
        itemModel.posterUrl = item.posterUrl;
        itemModel.viewerCount = item.viewerCount;
        itemModel.featured = item.featured;
        itemModel.engine = "movies 1";
        itemModel.sourceUrl = "https://fzmovies.net/movie-Spider%20Man%20No%20Way%20Home--hmp4.htm";

        const testSchedule = new TheaterItemScheduleModel ();
        testSchedule.item = itemModel;
        testSchedule.time = new Date(Date.now() + (30 * 1000));

        await testSchedule.save();

        itemModel.schedules = [testSchedule];
        const updated = await itemModel.save();
        console.log("CREATED ", updated.title);
    }

    console.log("DONE");
}).catch(err => console.error(err));

const cleanup = async () => {
    const theaterItemRepo = getRepository(TheaterItemModel);
    const scheduleItemRepo = getRepository(TheaterItemScheduleModel );
    await scheduleItemRepo.delete({});
    await theaterItemRepo.delete({});
    process.exit();
};

process.on('SIGINT', cleanup);