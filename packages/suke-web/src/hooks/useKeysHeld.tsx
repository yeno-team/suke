import { useEffect , useState } from "react";

export const useKeysHeld = () => {
    const [ keysHeld , setKeysHeld ] = useState<string[]>([])

    const keyPressed = (e : KeyboardEvent) : void => {
        setKeysHeld((prevKeys : string[]) => [...prevKeys , e.key])
    } 

    const keyReleased = (e : KeyboardEvent) : void => {
        setKeysHeld(keysHeld.filter((keyHeld) => keyHeld === e.key))
    }

    const isKeyHeld = (key : string) : boolean => keysHeld.findIndex((keyHeld) => keyHeld === key) !== -1

    useEffect(() => {
        window.addEventListener("keydown" , keyPressed)
        window.addEventListener("keyup" , keyReleased)

        return () => {
            window.removeEventListener("keydown" , keyPressed)
            window.removeEventListener("keyup", keyReleased)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [])

    return [ isKeyHeld ]
}