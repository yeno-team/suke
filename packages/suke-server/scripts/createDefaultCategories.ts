import { CategoryModel } from '@suke/suke-core/src/entities/Category';
import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import config from '../src/config';

const defaultCategories = [
    {
        value: "browsing",
        label: "Browsing",
        thumbnail_url: "https://i.vgy.me/6nNr8D.jpg"
    },
    {
        value: "movies",
        label: "Movies",
        thumbnail_url: "https://i.vgy.me/M92qiY.jpg"
    },
    {
        value: "tv_shows",
        label: "TV Shows",
        thumbnail_url: "https://i.vgy.me/yUcJ6b.jpg"
    },
    {
        value: "videos",
        label: "Videos",
        thumbnail_url: "https://i.vgy.me/QE0x55.jpg"
    },
    {
        value: "anime",
        label: "Anime",
        thumbnail_url: "https://i.vgy.me/gRW6i8.jpg"
    }
];

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [CategoryModel],
    synchronize: true,
}).then(async () => {
    console.log("Connected to DB instance.");
    const categoryRepo = getRepository(CategoryModel);
    
    for (const cat of defaultCategories) {
        const found = await categoryRepo.findOne({where: {value: cat.value}});

        if (found == null) {
            const newCategory = new CategoryModel();
            newCategory.value = cat.value;
            newCategory.label = cat.label;
            newCategory.thumbnail_url = cat.thumbnail_url;
            newCategory.viewerCount = 0;
            await newCategory.save();
            console.log("Created " + cat.label);
        }
    }
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});