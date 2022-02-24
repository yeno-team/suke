export const canPlayVideoUrl = (url: URL) => {
    try {
        if (url.hostname.endsWith("googlevideo.rs")) return true;

        return false;
    } catch (e) {
        console.error(e);
        return false;
    }
};