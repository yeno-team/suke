/**
 * Checks if an URL is valid or not.
 * @see {@link https://www.regextester.com/94502}
 * @param str
 * @returns boolean
 */
export default function isValidUrl(str : string) : boolean {
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return urlRegex.test(str)
}