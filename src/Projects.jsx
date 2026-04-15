import { useState } from "react";
import MainLayout from "./Layout";

const defaultProjects = [
  { id: 1, name: "FS Internship", client: "-", tracked: "261,8h", progress: "-", access: "Public", starred: true,  color: "bg-green-500" },
  { id: 2, name: "BE Internship", client: "-", tracked: "282,2h", progress: "-", access: "Public", starred: false, color: "bg-blue-400" },
];

const SortArrow = () => (
  <svg className="inline ml-1 w-3 h-3 text-gray-500" viewBox="0 0 10 14" fill="currentColor">
    <path d="M5 0L9.33 5H0.67L5 0Z"/>
    <path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.4"/>
  </svg>
);

export default function Projects() {
  const [projects, setProjects] = useState(defaultProjects);
  const [search, setSearch]     = useState("");
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState(1);

  const toggleStar = (id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => -d);
    else { setSortKey(key); setSortDir(1); }
  };

  const sorted = [...projects].sort((a, b) => {
    // starred always first
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    if (!sortKey) return 0;
    const av = a[sortKey] || "";
    const bv = b[sortKey] || "";
    return av < bv ? -sortDir : av > bv ? sortDir : 0;
  });

  const filtered = sorted.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cols = [
    { label: "NAME",     key: "name" },
    { label: "CLIENT",   key: "client" },
    { label: "TRACKED",  key: "tracked" },
    { label: "PROGRESS", key: "progress" },
    { label: "ACCESS",   key: "access" },
  ];

  return (
    <MainLayout>
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Projects</h2>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-lg flex items-center gap-0 mb-4 overflow-hidden">
        <span className="px-4 py-2.5 text-sm text-gray-400 border-r border-gray-200">Filter</span>

        {["Active", "Client", "Acess"].map((label) => (
          <button
            key={label}
            className="flex items-center gap-1 px-4 py-2.5 text-sm text-gray-600 border-r border-gray-200 hover:bg-gray-50 transition"
          >
            {label}
            <svg className="w-3 h-3 text-gray-400 ml-0.5" viewBox="0 0 10 6" fill="currentColor">
              <path d="M0 0l5 6 5-6z"/>
            </svg>
          </button>
        ))}

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Find by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm outline-none bg-transparent text-gray-600 w-full placeholder-gray-400"
          />
        </div>

        <button className="px-4 py-2.5 text-sm font-medium text-gray-700 border-l border-gray-200 hover:bg-gray-50 transition whitespace-nowrap">
          apply filter
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table header row (gray) */}
        <div className="bg-gray-100 px-6 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
          Projects
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {cols.map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none hover:text-gray-700"
                >
                  {label}<SortArrow />
                </th>
              ))}
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${project.color}`}></span>
                    <span className="text-gray-800">{project.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-500">{project.client}</td>
                <td className="px-6 py-3 text-gray-700">{project.tracked}</td>
                <td className="px-6 py-3 text-gray-500">{project.progress}</td>
                <td className="px-6 py-3 text-gray-700">{project.access}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => toggleStar(project.id)}
                    className="transition"
                    title={project.starred ? "Remove from favorites" : "Add to favorites"}
                  >
                    {project.starred ? (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 hover:text-yellow-400 transition" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}