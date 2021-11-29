import { usePrevious } from "./usePrevious"


export function useChanged<T>(val: T) {
    const prevVal = usePrevious<T>(val);
    
    return [
        prevVal !== val,
        prevVal
    ] as const;
}