import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faClipboardList, faClock, faChartBar, faProjectDiagram, faUsers } from "@fortawesome/free-solid-svg-icons";
import gridIcon from "./assets/Grid.png";

export default function Sidebar() {
    const location = useLocation();

    const menus = [
        { name: "Dashboard", path: "/", icon: faTachometerAlt },
        { name: "Boards", path: "/boards", icon: faClipboardList },
        { name: "Time Tracker", path: "/tracker", icon: faClock },
        { name: "Reports", path: "/reports", icon: faChartBar },
        { name: "Projects", path: "/projects", icon: faProjectDiagram },
        { name: "Team", path: "/team", icon: faUsers },
    ];

    return (
        <div className="w-56 bg-gray-100 border-r border-gray-200 flex flex-col">

            <div className="p-5 h-14 text-lg font-semibold text-gray-700 border-b border-gray-200 flex items-center gap-1 bg-white">
                <img src={gridIcon} alt=""   className="w-5" /> Braves <span className="text-blue-600">Board</span>
            </div>

            <div className="flex-1 p-2">
                {menus.map((menu) => {
                    const active = location.pathname === menu.path;

                    return (
                        <Link
                            key={menu.path}
                            to={menu.path}
                            className={`block px-4 py-2 rounded-lg mb-1 text-sm transition
                ${active
                                    ? "bg-white shadow text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-200"
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={menu.icon} />
                                <span>{menu.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}