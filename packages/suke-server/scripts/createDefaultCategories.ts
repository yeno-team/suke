import { CategoryModel } from '@suke/suke-core/src/entities/Category';
import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import config from '../src/config';

const defaultCategories = [
    {
        value: "browsing",
        label: "Browsing",
        thumbnail_url: "https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        value: "movies",
        label: "Movies",
        thumbnail_url: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/best-movies-1614634680.jpg"
    },
    {
        value: "tv_shows",
        label: "TV Shows",
        thumbnail_url: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fall-movies-index-1628968089.jpg"
    },
    {
        value: "videos",
        label: "Videos",
        thumbnail_url: "https://images.pexels.com/photos/34407/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        value: "anime",
        label: "Anime",
        thumbnail_url: "https://www.fortressofsolitude.co.za/wp-content/uploads/2019/05/The-15-Most-Powerful-Anime-Characters-Of-All-Time-scaled.jpg"
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