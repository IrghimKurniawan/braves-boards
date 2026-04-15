import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-6">
          <h1 className="font-semibold text-gray-700"></h1>

          <div className="flex items-center gap-4 text-gray-600">
            <span className="cursor-pointer"><FontAwesomeIcon icon={faQuestion} /></span>
            <span className="cursor-pointer"><FontAwesomeIcon icon={faBell} /></span>
            <span className="cursor-pointer"><FontAwesomeIcon icon={faUser} /></span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
}