import { IUser } from "@suke/suke-core/src/entities/User/User";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router";
import * as userApi from "../api/user";
import * as authApi from "../api/auth";
import { Role } from "@suke/suke-core/src/Role";

export interface AuthContextInterface {
    errors: Error[];
    user?: IUser;
    login: (name: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
    updateUser: () => void;
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
        updateUser();
    }, []);

    const updateUser = () => {
        userApi.getAuthenticatedUser()
            .then((user) => {
                console.log(user);
                setUser(user)
            })
            .catch((e) => {
                // User is probably not authenticated
                // Set to GUEST
                setUser({
                    id: 0,
                    email: 'guest@suke.app',
                    name: 'Guest',
                    role: Role.Guest,
                    following: [],
                    channel: {
                        id: 0,
                        followers: [],
                        desc: "",
                        desc_title: "",
                        roledUsers: []
                    }
                });
            })
            .finally(() => setLoadingInit(false))
    }

    const login = (name: string, password: string): void => {
        setLoading(true);

        authApi.login({name, password})
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

    const register = (name: string, email: string, password: string) => {
        setLoading(true);

        userApi.signup({name, email}, password)
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
            user, loading, errors, login, register, logout, updateUser
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