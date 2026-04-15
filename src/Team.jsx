import { useState } from "react";
import MainLayout from "./Layout";

const defaultMembers = [
  { id: 1, name: "Alpha",   email: "Alpha@emailkerja.com",   role: "Frontend", group: "Internship" },
  { id: 2, name: "Beta",    email: "Beta@emailkerja.com",    role: "Frontend", group: "Internship" },
  { id: 3, name: "Charlie", email: "Charlie@emailkerja.com", role: "Backend",  group: "Internship" },
];

const defaultGroups = [
  { id: 1, name: "Internship", members: 3 },
];

export default function Team() {
  const [tab, setTab]           = useState("Members");
  const [search, setSearch]     = useState("");
  const [allFilter, setAll]     = useState("All");
  const [roleFilter, setRole]   = useState("Role");
  const [groupFilter, setGroup] = useState("Group");

  const filteredMembers = defaultMembers.filter((m) => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const DropChevron = () => (
    <svg className="w-3 h-3 text-gray-400 ml-0.5 inline" viewBox="0 0 10 6" fill="currentColor">
      <path d="M0 0l5 6 5-6z"/>
    </svg>
  );

  return (
    <MainLayout>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Team</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {["Members", "Groups"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Members" && (
        <>
          {/* Filter bar */}
          <div className="bg-white border border-gray-200 rounded-lg flex items-center gap-0 mb-4 overflow-hidden">
            <span className="px-4 py-2.5 text-sm text-gray-400 border-r border-gray-200">Filter</span>

            {/* All dropdown */}
            <button className="flex items-center gap-1 px-4 py-2.5 text-sm text-gray-600 border-r border-gray-200 hover:bg-gray-50 transition">
              All <DropChevron />
            </button>
            <button className="flex items-center gap-1 px-4 py-2.5 text-sm text-gray-600 border-r border-gray-200 hover:bg-gray-50 transition">
              Role <DropChevron />
            </button>
            <button className="flex items-center gap-1 px-4 py-2.5 text-sm text-gray-600 border-r border-gray-200 hover:bg-gray-50 transition">
              Group <DropChevron />
            </button>

            {/* Search */}
            <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm outline-none bg-transparent text-gray-600 w-full placeholder-gray-400"
              />
            </div>

            <button className="px-4 py-2.5 text-sm font-medium text-gray-700 border-l border-gray-200 hover:bg-gray-50 transition whitespace-nowrap">
              apply filter
            </button>
          </div>

          {/* Members table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-6 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
              Members
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    { label: "NAME" },
                    { label: "EMAIL" },
                    { label: "ROLE" },
                    { label: "GROUP" },
                  ].map(({ label }) => (
                    <th key={label} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {label}
                      {(label === "NAME" || label === "EMAIL") && (
                        <svg className="inline ml-1 w-3 h-3" viewBox="0 0 10 14" fill="currentColor">
                          <path d="M5 0L9.33 5H0.67L5 0Z"/>
                          <path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.4"/>
                        </svg>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-800 font-medium">{m.name}</td>
                    <td className="px-6 py-3">
                      <a href={`mailto:${m.email}`} className="text-blue-500 hover:underline">
                        {m.email}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{m.role}</td>
                    <td className="px-6 py-3">
                      <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        {m.group}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Groups" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-100 px-6 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
            Groups
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Members</th>
              </tr>
            </thead>
            <tbody>
              {defaultGroups.map((g) => (
                <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-gray-800 font-medium">{g.name}</td>
                  <td className="px-6 py-3 text-gray-600">{g.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}