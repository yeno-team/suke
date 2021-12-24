import { usePrevious } from "./usePrevious"

/**
 * 
 * @param val 
 * @returns [previousValueChanged, prevVal]
 */
export function useChanged<T>(val: T) {
    const prevVal = usePrevious<T>(val);
    
    return [
        prevVal !== val,
        prevVal
    ] as const;
}