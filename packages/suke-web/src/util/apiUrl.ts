export const apiUrl = (path: string) => {
    if (process.env.NODE_ENV === 'production') {
        return new URL(path, 'http://localhost:4000')
    } else {
        return new URL(path, 'http://localhost:4000')
    }
}

export default apiUrl;