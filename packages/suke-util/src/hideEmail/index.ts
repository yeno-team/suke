export const hideEmail = (email : string) : string => {
    const [ name , tld ] = email.split("@");

    const avgLength = Math.ceil(name.length / 2);
    const shortName = name.substring(0 , name.length - avgLength);
    
    return `${shortName}${"*".repeat(avgLength)}@${tld}`;
};