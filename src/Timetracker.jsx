import MainLayout from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTag, faCalendar } from "@fortawesome/free-solid-svg-icons";

export default function Timetracker() {

    const data = [
        {
            date: "Thu, Apr 2",
            total: "04:00:00",
            items: [
                {
                    title: "Snap Journal - Fixing some bugs in home...",
                    project: "FS Internship",
                    time: "19.00 - 21.00",
                    duration: "02:00:00",
                },
                {
                    title: "Snap Journal - Adding theme feature...",
                    project: "FS Internship",
                    time: "15.00 - 16.00",
                    duration: "01:00:00",
                },
            ],
        },
    ];

    return (
        <MainLayout>

            <div className="bg-white p-4 rounded-xl shadow border mb-6 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="What are you working on?"
                    className="flex-1 outline-none text-sm"
                />

                <FontAwesomeIcon icon={faTag} className="text-gray-400 cursor-pointer" />
                <FontAwesomeIcon icon={faCalendar} className="text-gray-400 cursor-pointer" />

                <span className="text-sm text-gray-600">00:00:00</span>

                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-600">
                    Start
                </button>
            </div>

            <h2 className="text-sm font-semibold text-gray-600 mb-3">
                This week
            </h2>

            <div className="space-y-4">
                {data.map((group, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl border">

                        <div className="flex justify-between text-xs text-gray-500 px-4 py-2 border-b">
                            <span>{group.date}</span>
                            <span>Total: {group.total}</span>
                        </div>

                        <div className="divide-y">
                            {group.items.map((item, j) => (
                                <div
                                    key={j}
                                    className="flex items-center justify-between px-4 py-3 bg-white"
                                >
                                    <div>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {item.title}
                                        </p>
                                        <span className="text-xs text-orange-500">
                                            • {item.project}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500 flex items-center gap-4">
                                        <span>{item.time}</span>
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-700">{item.duration}</span>

                                        <button className="text-gray-500 hover:text-blue-500">
                                            <FontAwesomeIcon icon={faPlay} />
                                        </button>

                                        <span className="text-gray-400 cursor-pointer">⋮</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

        </MainLayout>
    );
}