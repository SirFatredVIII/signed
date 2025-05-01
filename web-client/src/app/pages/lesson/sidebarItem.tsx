import { faHouse, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SidebarItemProps {
    label: string;
    active: boolean;
    action: () => void;
    icon: IconDefinition | undefined;
    type: "actionItem" | "lessonItem";
    completed: boolean;
}

/**
 * An item on the sidebar, representing either an action to take (such as 
 * navigating to another page) or an upcoming lesson item.
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({label, active, icon, action, type, completed}) => {

    let style = " bg-signed-light-blue inset-shadow-lg "
    if (!active) {
        style = " text-signed-light-blue "
    }

    if (active && type === "lessonItem") {
        style = " text-signed-light-blue font-bold underline "
    }

    const hoverStyle = (type === "actionItem") ? " hover:text-white hover:bg-signed-blue hover:cursor-pointer " : ""

    const crossedOut = completed ? " line-through " : " "

    return (
        <div className={"m-2 pt-1 pb-1 pl-2 pr-2 rounded-md flex items-center select-none " + style + hoverStyle + crossedOut} onClick={action}>
            {icon && <FontAwesomeIcon icon={icon} />}
            <div className="pl-2">{label}</div>
        </div>
    )
}