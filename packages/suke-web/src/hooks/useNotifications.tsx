import React , { useContext } from "react";
import ReactNotification , { ReactNotificationOptions, store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css';

export const defaultNotificationOpts : ReactNotificationOptions = {
    container : "bottom-right",
    animationIn : ["animate__animated","animate__fadeIn"],
    animationOut : ["animate__animated","animate__fadeOutDown"],
    dismiss : {
        duration : 3000,
        pauseOnHover : true,
        onScreen : true,
        showIcon : true
    }
}
export const NotificationContext = React.createContext({} as unknown as typeof store);

export const NotificationProvider = ({ children } : { children : React.ReactNode }) : JSX.Element => {  
    return (
        <NotificationContext.Provider value={store}>
            <ReactNotification isMobile={true}/>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    return useContext(NotificationContext)
}