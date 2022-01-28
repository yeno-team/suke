import classNames from "classnames"
import { useRef, useState } from "react";


export interface TextInputProps {
    type: string;
    autoComplete?: string;
    placeholder?: string;
    onChange?: (e: string) => void;
    onInputEnd?: (val: string) => void;
    onInputStart?: () => void;
    className?: string;
    children?: React.ReactNode;
    autoSubmit?: boolean;
    autoSubmitDelay?: number; 
}

export const TextInput = ({type, onChange, onInputEnd, onInputStart, className, children, autoComplete, placeholder, autoSubmit, autoSubmitDelay = 500}: TextInputProps) => {
    const [value, setValue] = useState("");
    const [inputTimer, setInputTimer] = useState<NodeJS.Timer>();
    const valueRef = useRef(value);
    valueRef.current = value;
    
    const triggerOnChange = (val: string) => {
        clearTimeout(inputTimer!);
        setValue(val);
        if (onChange) onChange(value);
        if (onInputStart) onInputStart();
        if (autoSubmit) setInputTimer(setTimeout(triggerInputEnd, autoSubmitDelay));
    }

    const triggerInputEnd = () => {
        if (onInputEnd) onInputEnd(valueRef.current);
    }

    return <input autoComplete={autoComplete} type={type} value={value} placeholder={placeholder || ""} onChange={e => {triggerOnChange(e.target.value)}} className={classNames("p-2", className)}>{children}</input>
}