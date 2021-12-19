import { useEffect , useCallback , useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const useRecaptcha = (action : string) => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [ reCaptchaToken , setRecaptchaToken ] = useState<string>("")

    const handleReCaptchaVerify = useCallback(async () => {
        if(!(executeRecaptcha)) {
            return
        }

        const token = await executeRecaptcha(action)
        setRecaptchaToken(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [executeRecaptcha])

    useEffect(() => {
        handleReCaptchaVerify()
    } , [handleReCaptchaVerify])

    return [ reCaptchaToken , handleReCaptchaVerify ] as const
}