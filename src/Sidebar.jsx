import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faClipboardList,
  faClock,
  faChartBar,
  faProjectDiagram,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const location = useLocation();

  const menus = [
    { name: "Dashboard",    path: "/dashboard", icon: faTachometerAlt },
    { name: "Boards",       path: "/boards",    icon: faClipboardList },
    { name: "Time Tracker", path: "/tracker",   icon: faClock },
    { name: "Reports",      path: "/reports",   icon: faChartBar },
    { name: "Projects",     path: "/projects",  icon: faProjectDiagram },
    { name: "Team",         path: "/team",      icon: faUsers },
  ];

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      <nav className="flex-1 py-3 px-3 flex flex-col gap-0.5">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                ${active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
            >
              <FontAwesomeIcon
                icon={menu.icon}
                className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`}
              />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}