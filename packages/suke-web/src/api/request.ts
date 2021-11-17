export const postWithJsonData = (url: string, data: object) => {
    return fetch(url, {
        'method': 'POST',
        'headers': {
            'Content-Type': "Application/Json"
        },
        'body': JSON.stringify(data)
    });
}