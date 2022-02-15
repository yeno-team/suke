export const getScheduleDayNames = (startDate: Date, count: number, locale: string) => {
    const output: {date: Date, name: string}[] = [];

    for (let i = 0;i < count;i++) {
        let currentDate = new Date(startDate);

        if (i !== 0) {
            currentDate.setDate(currentDate.getDate() + (i))
        }

        let name = currentDate.toLocaleString('en-us', {weekday: 'long'}) + " " + (currentDate.getMonth()+1) + "/" + currentDate.getDate();

        if (i === 0) {
            name = 'Today';
        } else if (i === 1) {
            name = 'Tomorrow';
        }

        output.push({
            date: currentDate,
            name
        });
    }

    return output;
}