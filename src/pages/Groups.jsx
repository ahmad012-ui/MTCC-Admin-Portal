import { useMemo } from "react"
import { FaUsers, FaUserPlus, FaSearch, FaChevronRight } from "react-icons/fa"

const groups = [
  {
    id: "g1",
    name: "Executive Leadership",
    owner: "Sinead Waters",
    members: 8,
    status: "Active",
    created: "Apr 16, 2026",
    description: "Senior team responsible for strategic planning and performance review.",
  },
  {
    id: "g2",
    name: "Quality & Compliance",
    owner: "Jessica Harrington",
    members: 12,
    status: "Active",
    created: "Mar 9, 2026",
    description: "Group managing audits, corrective actions, and ISO compliance activities.",
  },
  {
    id: "g3",
    name: "Customer Success",
    owner: "Andy Brown",
    members: 6,
    status: "Pending",
    created: "May 3, 2026",
    description: "Team focused on onboarding, retention, and customer satisfaction reviews.",
  },
  {
    id: "g4",
    name: "Operations Planning",
    owner: "Harri Lloyd-Davies",
    members: 10,
    status: "Archived",
    created: "Jan 20, 2026",
    description: "Operational working group for process improvements and control planning.",
  },
]

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Archived: "bg-slate-100 text-slate-600 border-slate-200",
}

export default function Groups() {
  const summary = useMemo(() => {
    const total = groups.length
    const active = groups.filter((group) => group.status === "Active").length
    const pending = groups.filter((group) => group.status === "Pending").length
    const members = groups.reduce((sum, group) => sum + group.members, 0)
    return { total, active, pending, members }
  }, [])

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Groups</p>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Team groups and memberships</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">Organize your users into functional groups, track ownership, and review membership at a glance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-xl border border-teal-100 hover:bg-teal-100/80 transition-colors">
            <FaUserPlus className="w-4 h-4" /> Create group
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total groups", value: summary.total },
          { label: "Active groups", value: summary.active },
          { label: "Members total", value: summary.members },
          { label: "Pending groups", value: summary.pending },
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm h-full">
            <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Group list</h2>
            <p className="text-sm text-slate-500">Browse active, pending, and archived groups with quick membership details.</p>
          </div>
          <div className="flex items-center gap-3 max-w-md w-full">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400"><FaSearch /></span>
              <input
                type="search"
                placeholder="Search groups"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>
            <button className="px-4 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors">
              Filters
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="text-sm font-semibold text-slate-900">{group.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{group.description}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{group.owner}</td>
                  <td className="px-4 py-4 text-slate-700">{group.members}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[group.status]}`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{group.created}</td>
                  <td className="px-4 py-4">
                    <button className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                      View <FaChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
