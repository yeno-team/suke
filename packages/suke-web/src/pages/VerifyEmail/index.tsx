import React , { useEffect , useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "@suke/suke-web/src/api/account/";
import { IUser } from "@suke/suke-core/src/entities/User";

export interface VerifyEmailPageProps {
    user? : IUser
}

export const VerifyEmailPage = ({ user } : VerifyEmailPageProps) => {
    const [ requestInit , setRequestInit ] = useState(true);
    const [ message , setMessage ] = useState("");
    const { token } =  useParams();


    useEffect(() => {
        async function init() {
            if(!(token)) {
                setMessage("Token is missing from the url.");
                setRequestInit(false);
                return;
            }

            if(user && user.isVerified) {
                setMessage("You're email is already verified.");
                setRequestInit(false);
                return;
            }

            try {
                await verifyEmail({ token });
                setMessage("You've successfully verified your email.");
            } catch (e) {
                setMessage("There was a problem verifying your email.");
            }

            setRequestInit(false);
        }
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [])

    return (
        <h1> { requestInit ? "Verifying your email address..." : message }</h1>
    )

}