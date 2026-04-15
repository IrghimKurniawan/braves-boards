import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion, faBell, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* TOP HEADER - white, with logo on left and icons on right */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="7" height="7" rx="1" fill="#1D4ED8"/>
            <rect x="12" y="1" width="7" height="7" rx="1" fill="#1D4ED8"/>
            <rect x="1" y="12" width="7" height="7" rx="1" fill="#1D4ED8"/>
            <rect x="12" y="12" width="7" height="7" rx="1" fill="#1D4ED8"/>
          </svg>
          <span className="text-gray-800">Braves</span>
          <span className="text-blue-600">Board</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-600">
            <FontAwesomeIcon icon={faQuestion} className="text-sm" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-600">
            <FontAwesomeIcon icon={faBell} className="text-sm" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 transition text-gray-600">
            <FontAwesomeIcon icon={faUser} className="text-sm" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}