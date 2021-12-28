import React , { useContext } from "react";
import ReactNotification , { store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css';

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