import classNames from "classnames"

export interface CheckboxProps {
    className?: string;
    onClick?: () => void;
    active: boolean;
}

export const Checkbox = ({className, active, onClick}: CheckboxProps) => {
    return (
        <div className={classNames(
            "w-10 h-6 rounded-full bg-white cursor-pointer",
            active && "bg-green",
            className
        )} onClick={onClick}>
            <div className={classNames(
                active && "translate-x-2/3",
                "w-6 h-6 rounded-full transform transition bg-gray"
            )}></div>
        </div>
    )
}
