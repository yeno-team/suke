

export interface CategoryCardProps {
    name: string;
    viewerCount: string;
    imageUrl: string;
}

export const CategoryCard = ({name, viewerCount, imageUrl}: CategoryCardProps) => {
    return (
        <div className="mr-2 mb-2 bg-no-repeat bg-cover w-60 h-80 inline-flex justify-center items-center transform cursor-pointer hover:-translate-y-2" style={{backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url('${imageUrl}')`}}>
            <div className="font-signika text-lightgray text-center">
                <h1 className="font-bold text-2xl leading-none">{name}</h1>
                <h3 className="font-thin text">{viewerCount} Viewers</h3>
            </div>
        </div>
    )
}