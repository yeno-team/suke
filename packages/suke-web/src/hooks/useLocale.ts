// https://stackoverflow.com/questions/673905/how-to-determine-users-locale-within-browser
export const useLocale = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;