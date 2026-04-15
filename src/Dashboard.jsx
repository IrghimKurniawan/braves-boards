import MainLayout from "./Layout";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Manage Tasks and Track Time Efficiently
        </h2>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
          + Create New Board
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white w-60 p-4 rounded-xl shadow border">
        <h3 className="font-semibold text-gray-800 mb-2">
          First Board
        </h3>

        <p className="text-sm text-gray-500">0 tasks</p>

        <p className="text-xs text-gray-400 mt-2">
          Total Time : 0s
        </p>
      </div>
    </MainLayout>
  );
}