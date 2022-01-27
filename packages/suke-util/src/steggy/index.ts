// https://github.com/perestaj/Easy-Steganography/tree/main/easy-steganography/src
import Jimp from "jimp";

const initMessage = "zzDannyWazHere";

const readMessageSegment = (image : Buffer , startIndex : number , length : number) : string  => {
    let result = '';

    for (let i = 0; i < length; i++) {
        let currentByte = 0;

        for (let bit = 0; bit < 8; bit++) {
            if ((image[(i + startIndex) * 8 + bit] & 1) == 1) {
                currentByte += (1 << bit);
            }
        }

        result += String.fromCharCode(currentByte);
    }

    return result;
};

const readMessage = (image : Jimp) : string => {
    const messageHeader = readMessageSegment(image.bitmap.data , 0 , initMessage.length);

    if(messageHeader !== initMessage) {
        return "";
    }

    const length = +readMessageSegment(image.bitmap.data , initMessage.length, 16);
    const message = readMessageSegment(image.bitmap.data , initMessage.length + 16 , length);

    return message;
};

const hideMessage = (image : Jimp , message : string) : Jimp => {
    let messageLength = message.length.toString();

    while (messageLength.length < 16) {
        messageLength = "0" + messageLength;
    }

    const messageToHide = initMessage + messageLength + message;

    for (let i = 0; i < messageToHide.length; i++)
    {
        for (let p = 0; p < 8; p++)
        {
            const pow = 1 << p;
            
            image.bitmap.data[i * 8 + p] = (messageToHide.charCodeAt(i) & pow) === pow ?
            image.bitmap.data[i * 8 + p] | 1 :
            image.bitmap.data[i * 8 + p] & 254;
        }
    }

    return image; 
};

export default { 
    hideMessage , 
    readMessage
};