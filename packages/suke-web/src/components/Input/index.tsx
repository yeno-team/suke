import classNames from "classnames";
import React from "react";

export interface InputProps {
    containerClassName? : string,
    inputClassName? : string,
    inputPlaceholder? : string,
    icon? : JSX.Element
    value : string,
    onChange : React.Dispatch<React.SetStateAction<string>>
}

const Input = (
    { 
        containerClassName,
        inputClassName,
        inputPlaceholder,
        icon,
        value,
        onChange
    } : InputProps 
)  => {
    return (
        <div className={classNames(
            containerClassName,
            "flex",
            "flex-row",
            "items-center",
            "px-5",
            "bg-black"
        )}>
            <input 
                type="text" 
                className={classNames(
                    inputClassName,
                    "bg-transparent",
                    "flex-1",  
                    "py-3",
                    "focus:outline-none",
                    "text-gray",
                )}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={inputPlaceholder}

            />
            {icon}
        </div>
    )
}

export default Input;