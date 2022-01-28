import { useEffect, useState } from "react";

export const useScreenSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;
    const isTablet = !isMobile && width <= 1024;

    return { width, isMobile, isTablet }

}