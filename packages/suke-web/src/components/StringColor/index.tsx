import { colorShade, stringToColor } from "@suke/suke-util"


export interface StringColorProps {
    className?: string;
    baseString: string;
    brightness: number;
    bold: boolean,
    children: React.ReactNode;
}

export const StringColor = ({baseString, brightness, bold, children, className}: StringColorProps) => {
    const color = colorShade(stringToColor(baseString), brightness);
    
    return ( 
        <div className={className} style={{
            color, 
            fontWeight: bold ? 'bold' : 'normal',
            display: 'inline-block',
            margin: 0
            
        }}>
            {children}
        </div>
    )
}