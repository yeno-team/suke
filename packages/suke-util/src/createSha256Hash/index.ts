import crypto from 'crypto';

export const createSHA256Hash = (data : string) : string => {
    return crypto.createHash("sha256").update(data).digest("hex")
}