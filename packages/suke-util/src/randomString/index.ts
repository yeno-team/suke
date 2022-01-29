import crypto from 'crypto';

//https://stackoverflow.com/a/34387027/11560000
export const randomString = (len : number) : string => {
    return crypto.randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0,len)
    .toUpperCase();
};