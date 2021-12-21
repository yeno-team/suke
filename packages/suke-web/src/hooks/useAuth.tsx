import { IUser } from "@suke/suke-core/src/entities/User/User";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";
import * as userApi from "../api/user";
import * as authApi from "../api/auth";
import { Role } from "@suke/suke-core/src/Role";

export interface AuthContextInterface {
    errors: Error[];
    user?: IUser;
    login: (name: string, password: string , reCaptchaToken : string) => void;
    register: (name: string, email: string, password: string , reCaptchaToken : string) => void;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = React.createContext<AuthContextInterface>({} as AuthContextInterface);

export const AuthProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
    const [user, setUser] = useState<IUser>();
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(true);
    const [errors, setErrors] = useState<Error[]>([]);

    const history = useHistory();
    const location = useLocation();

    // remove all errors if pathname changes
    useEffect(() => {
        if (errors.length > 0) setErrors([]);
    }, [location.pathname, errors]);


    // See if user is already authenticated
    useEffect(() => {
        userApi.getAuthenticatedUser()
            .then((user) => setUser(user))
            .catch((e) => {
                // User is probably not authenticated
                // Set to GUEST
                setUser({
                    id: 0,
                    email: 'guest@suke.app',
                    name: 'Guest',
                    role: Role.Guest,
                    channel: {
                        id: 0,
                        followers: 0,
                        desc: "",
                        desc_title: "",
                        roledUsers: []
                    }
                });
            })
            .finally(() => setLoadingInit(false))
    }, []);


    const login = (name: string, password: string , reCaptchaToken : string): void => {
        setLoading(true);

        authApi.login({name, password , reCaptchaToken })
            .then((data) => {
                if (data.error === true) {
                    setErrors([...errors, new Error(data.message)]);
                    return;
                }

                setUser(data);
                history.push("/");
            })
            .catch((e: Error) => {
                setErrors([...errors, e]);
            })
            .finally(() => setLoading(false));
    } 

    const register = (name: string, email: string, password: string , reCaptchaToken : string) => {
        setLoading(true);

        userApi.signup({name, email}, password , reCaptchaToken)
            .then((data) => {
                if (data.error === true) {
                    setErrors([...errors, new Error(data.message)]);
                    return;
                }

                setUser(data);
                history.push("/");
            })
            .catch((e: Error) => {
                setErrors([...errors, e]);
            })
            .finally(() => setLoading(false));
    }

    const logout = () => {
        authApi.logout()
            .then(() => {
                setUser(undefined)
            })
            .catch((err) => {
                setErrors([...errors, err])
            })
    }

    const memoedValue = useMemo(
        () => ({
            user, loading, errors, login, register, logout
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, loading, errors]
    );


    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInit && children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}