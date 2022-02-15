import { ReactElement, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

export interface FeaturedSliderProps {
    items: ReactElement[]
}

export const FeaturedSlider = ({items}: FeaturedSliderProps) => {
    const [itemIndex, setItemIndex] = useState(0);

    const responsive = {
        0: { items: 1 },
        1000: { items: 2 }
    };

    const slideNext = () => {
        if (itemIndex < items.length - 1) {
            setItemIndex(itemIndex + 1);
        } else {
            setItemIndex(0);
        }
    };

    const slidePrev = () => {
        if (itemIndex > 0) {
            setItemIndex(itemIndex - 1);
        }
    };

    return (
        <div className="relative">
            <AliceCarousel 
                activeIndex={itemIndex}
                mouseTracking 
                animationDuration={800}
                items={items} 
                responsive={responsive} 
                controlsStrategy="default" 
                disableDotsControls
                disableButtonsControls
                infinite
            />
            <div className="text-white flex text-5xl absolute z-10 top-1/2 transform -translate-y-1/2 w-full px-10">
                <div className="cursor-pointer select-none" onClick={slidePrev}>&lang;</div>
                <div className="cursor-pointer ml-auto transform rotate-180 select-none" onClick={slideNext}>&lang;</div>
            </div>
        </div>   
    )
}