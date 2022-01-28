export interface HasId {
    id : string
}


export const binarySearch = (data : Array<HasId> , id : string) : unknown => {
    const idAsInt = parseInt(id);
    let startIndex = 0;
    let stopIndex = data.length;
    let middle = Math.floor((stopIndex + startIndex) / 2);


    while(parseInt(data[middle].id) !== idAsInt && startIndex < stopIndex) {
        if(idAsInt < parseInt(data[middle].id)) {
            stopIndex = middle - 1;
        } else if(idAsInt > +data[middle].id) {
            startIndex = middle + 1;
        }

        middle = Math.floor((stopIndex + startIndex) / 2);
    }

    return parseInt(data[middle].id) !== idAsInt ? null : data[middle];
};