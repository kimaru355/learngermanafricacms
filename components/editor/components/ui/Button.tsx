import { cn } from "@/lib/utils";
import { FC } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const buttonStyles = (active: boolean) =>
    cn(
        "flex hover:bg-gray-300 disabled:opacity-50 p-2 rounded disabled:cursor-not-allowed transition-colors",
        {
            "bg-gray-300": active,
            "bg-transparent": !active,
        }
    );

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    toolTip: string;
}

export const Button: FC<ButtonProps> = ({
    active = false,
    toolTip,
    ...props
}) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    {...props}
                    className={`${buttonStyles(active)} ${
                        props.className || ""
                    }`}
                />
                <TooltipContent>
                    <p>{toolTip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
