import MainLayout from "./Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Boards() {

    const boards = [
        {
            title: "To Do",
            tasks: [],
        },
        {
            title: "Doing",
            tasks: [
                {
                    title: "First Board",
                    tasksCount: 0,
                    time: "0s",
                },
            ],
        },
        {
            title: "In Review",
            tasks: [],
        },
    ];

    return (
        <MainLayout>
            <div className="flex gap-6 overflow-x-auto">

                {boards.map((board, index) => (
                    <div
                        key={index}
                        className="h-screen min-w-[280px] bg-gray-100 rounded-xl border p-3 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-700">
                                {board.title} ({board.tasks.length})
                            </h3>
                            <span className="cursor-pointer text-gray-400">⋮</span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {board.tasks.length === 0 ? (
                                <div className="text-xs text-gray-400 text-center py-10">
                                    No tasks
                                </div>
                            ) : (
                                board.tasks.map((task, i) => (
                                    <div
                                        key={i}
                                        className="bg-white p-3 rounded-lg shadow-sm border"
                                    >
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {task.title}
                                        </h4>

                                        <p className="text-xs text-gray-400 mt-1">
                                            {task.tasksCount} tasks
                                        </p>

                                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                            <span>
                                                <FontAwesomeIcon icon={faClock} className="mr-1" />
                                                {task.time}
                                            </span>

                                            <button className="border px-2 py-1 rounded text-xs hover:bg-gray-100">
                                                <FontAwesomeIcon icon={faPlay} className="mr-1" /> Start
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button className="w-full text-left text-xs text-gray-500 border border-dashed rounded-lg py-2 hover:bg-gray-200 mt-3">
                            + Add Card
                        </button>
                    </div>
                ))}

            </div>
        </MainLayout>
    );
}