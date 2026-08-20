import { useState, useMemo, useRef } from "react"
import { FaUsers, FaExchangeAlt, FaChartPie, FaCalendarAlt, FaSearch } from "react-icons/fa"
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const recentActivity = [
  { contact: "Richard Davis",      email: "richard@mtcc.uk",          status: "invited",   date: "5/14/2026" },
  { contact: "Joel Test",          email: "joel@mtcc.uk",             status: "completed", date: "5/12/2026" },
  { contact: "Sinead Waters",      email: "sinead@mtcc.uk",           status: "completed", date: "5/7/2026"  },
  { contact: "Jessica Harrington", email: "jessica@mtcc.uk",          status: "invited",   date: "4/27/2026" },
  { contact: "Andy Brown",         email: "andy@great-circle.co.uk",  status: "invited",   date: "4/14/2026" },
  { contact: "Michael Scott",      email: "michael@mtcc.uk",          status: "completed", date: "4/10/2026" },
  { contact: "Emma Johnson",       email: "emma@mtcc.uk",             status: "invited",   date: "4/08/2026" },
  { contact: "David Miller",       email: "david@mtcc.uk",            status: "completed", date: "4/02/2026" },
  { contact: "Sophia Wilson",      email: "sophia@mtcc.uk",           status: "invited",   date: "3/29/2026" },
  { contact: "James Taylor",       email: "james@mtcc.uk",            status: "completed", date: "3/25/2026" },
  { contact: "Olivia Anderson",    email: "olivia@mtcc.uk",           status: "invited",   date: "3/20/2026" },
  { contact: "William Thomas",     email: "william@mtcc.uk",          status: "completed", date: "3/15/2026" },
  { contact: "Isabella Moore",     email: "isabella@mtcc.uk",         status: "invited",   date: "3/10/2026" },
  { contact: "Daniel White",       email: "daniel@mtcc.uk",           status: "completed", date: "3/05/2026" },
  { contact: "Ava Martin",         email: "ava@mtcc.uk",              status: "invited",   date: "3/01/2026" },
  { contact: "Ethan Clark",        email: "ethan@mtcc.uk",            status: "completed", date: "6/03/2026" },
  { contact: "Mia Walker",         email: "mia@mtcc.uk",              status: "invited",   date: "6/06/2026" },
  { contact: "Noah Harris",        email: "noah@mtcc.uk",             status: "completed", date: "6/10/2026" },
  { contact: "Charlotte Lewis",    email: "charlotte@mtcc.uk",        status: "invited",   date: "6/14/2026" },
  { contact: "Benjamin Hall",      email: "benjamin@mtcc.uk",         status: "completed", date: "6/18/2026" },
  { contact: "Amelia Young",       email: "amelia@mtcc.uk",           status: "invited",   date: "7/02/2026" },
  { contact: "Lucas King",         email: "lucas@mtcc.uk",            status: "completed", date: "7/07/2026" },
  { contact: "Harper Wright",      email: "harper@mtcc.uk",           status: "invited",   date: "7/12/2026" },
  { contact: "Henry Lopez",        email: "henry@mtcc.uk",            status: "completed", date: "7/18/2026" },
  { contact: "Ella Hill",          email: "ella@mtcc.uk",             status: "invited",   date: "7/24/2026" },
  { contact: "Jack Green",         email: "jack@mtcc.uk",             status: "completed", date: "8/01/2026" },
  { contact: "Grace Adams",        email: "grace@mtcc.uk",            status: "invited",   date: "8/05/2026" },
  { contact: "Samuel Baker",       email: "samuel@mtcc.uk",           status: "completed", date: "8/11/2026" },
  { contact: "Chloe Nelson",       email: "chloe@mtcc.uk",            status: "invited",   date: "8/17/2026" },
  { contact: "Leo Carter",         email: "leo@mtcc.uk",              status: "completed", date: "8/23/2026" },
]

const completionData = [
  { month: "Mar",   completions: recentActivity.filter(a => a.date.startsWith("3/")).length },
  { month: "Apr",   completions: recentActivity.filter(a => a.date.startsWith("4/")).length },
  { month: "May",   completions: recentActivity.filter(a => a.date.startsWith("5/")).length },
  { month: "Jun",   completions: recentActivity.filter(a => a.date.startsWith("6/")).length },
  { month: "Jul",   completions: recentActivity.filter(a => a.date.startsWith("7/")).length },
  { month: "Aug",   completions: recentActivity.filter(a => a.date.startsWith("8/")).length },
]

const activityFeed = [
  { text: "Joel Test completed ISO 9001 Diagnostic",          time: "12 minutes ago" },
  { text: "Sinead Waters was invited to Business Diagnostic", time: "1 hour ago"     },
  { text: "Jessica Harrington reminder sent",                 time: "3 hours ago"    },
]

const templatePerformance = [
  { template: "Business Diagnostic",          sent: 3,  completed: 1, rate: "33%", median: 6895 },
  { template: "ISO 9001 Diagnostic (MASTER)", sent: 10, completed: 2, rate: "20%", median: 5    },
  { template: "ISO 14001 Diagnostic (MASTER)",sent: 0,  completed: 0, rate: "0%",  median: "-"  },
]

function StatusBadge({ status }) {
  const styles = {
    completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    invited:   "bg-amber-50 text-amber-700 border-amber-100",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${styles[status] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
      {status}
    </span>
  )
}

function InputField({ label, type = "text", placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500 transition-colors"
      />
    </div>
  )
}

export default function Dashboard({ failures = [] }) {

  const [search, setSearch]       = useState("")
  const [dateRange, setDateRange] = useState("90")   // default 90 days
  const [activeModal, setActiveModal] = useState(null)
  const { isOpen, onOpen, onClose }   = useDisclosure()
  const itemsPerPage = 7

  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const [diagnosticForm, setDiagnosticForm] = useState({ name: "", type: "Business", version: "1" })
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" })

  const openModal = (type) => {
    setActiveModal(type)
    onOpen()
  }

  // Handle local modal closure and clean up states
  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  // Triggered when clicking the dashed drag-and-drop container
  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle selecting files via browser explorer
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      console.log("Selected file ready for import:", file.name)
    }
  }

  const handleSave = () => {
    console.log(`--- Saving Action for Action Mode: "${activeModal}" ---`)
    
    if (activeModal === "diagnostic") {
      console.log("Saving Diagnostic Data Submitting to DB:", diagnosticForm)
      // Future API Call: axios.post('/api/diagnostics', diagnosticForm)
    } 
    else if (activeModal === "contact") {
      console.log("Saving Contact Registration Data:", contactForm)
      // Future API Call: axios.post('/api/contacts', contactForm)
    } 
    else if (activeModal === "templates") {
      if (!selectedFile) {
        alert("Please choose or upload a spreadsheet file first.")
        return
      }
      console.log("Uploading template manifest file binary:", selectedFile.name)
      // Future API Call: FormData binary dispatch
    }
    handleClose()
  }

  const filtered = useMemo(() => {
    const today  = new Date()
    const cutoff = new Date(today - Number(dateRange) * 24 * 60 * 60 * 1000)

    return recentActivity.filter(row => {
      const rowDate      = new Date(row.date)
      const withinRange  = rowDate >= cutoff
      const matchesSearch =
        row.contact.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase())
      return withinRange && matchesSearch
    })
  }, [search, dateRange])
  const sinceDateString = useMemo(() => {
    const today = new Date()
    const cutoff = new Date(today - Number(dateRange) * 24 * 60 * 60 * 1000)

    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: '2-digit',
      year: 'numeric'
    }).format(cutoff)
  }, [dateRange])
  const totalDiagnostics = filtered.length
  const completed        = filtered.filter(r => r.status === "completed").length
  const inProgress       = filtered.filter(r => r.status === "invited").length

  const columns = useMemo(() => [
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "email",   header: "Email"   },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue()} />
    },
    { accessorKey: "date", header: "Date" },
  ], [])

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: itemsPerPage } }
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows  = filtered.length
  const startIndex = pageIndex * pageSize
  const endIndex   = Math.min(startIndex + pageSize, totalRows)

  const statMetrics = [
    { label: "Total Diagnostics", value: totalDiagnostics, icon: FaUsers,       color: "text-blue-600",   bg: "bg-blue-50"   },
    { label: "Completed",         value: completed,         icon: FaChartPie,    color: "text-emerald-600",bg: "bg-emerald-50" },
    { label: "In Progress",       value: inProgress,        icon: FaExchangeAlt, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Expiring Soon",     value: "0",               icon: FaCalendarAlt, color: "text-amber-600",  bg: "bg-amber-50"  },
  ]

  const modalConfig = {
    diagnostic: {
      title: "Create Diagnostic",
      body: (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Name</label>
            <input
              type="text"
              value={diagnosticForm.name}
              onChange={(e) => setDiagnosticForm({ ...diagnosticForm, name: e.target.value })}
              placeholder="e.g. Business Diagnostic"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              value={diagnosticForm.type}
              onChange={(e) => setDiagnosticForm({ ...diagnosticForm, type: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500 bg-white"
            >
              <option>Business</option>
              <option>ISO 9001</option>
              <option>ISO 14001</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="number"
              value={diagnosticForm.version}
              onChange={(e) => setDiagnosticForm({ ...diagnosticForm, version: e.target.value })}
              placeholder="e.g. 1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
            />
          </div>
        </>
      )
    },
    contact: {
      title: "Create Contact",
      body: (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="e.g. Richard Davis"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              placeholder="e.g. +44 7700 900000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="e.g. richard@mtcc.uk"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500"
            />
          </div>
        </>
      )
    },
    templates: {
      title: "Import Templates",
      body: (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <div 
              onClick={handleDropzoneClick}
              className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer bg-slate-50/50"
            >
              {selectedFile ? (
                <div>
                  <p className="text-sm font-semibold text-emerald-600">Selected file:</p>
                  <p className="text-xs text-gray-600 font-mono mt-1">{selectedFile.name}</p>
                  <p className="text-[10px] text-gray-400 mt-2">Click again to change file</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Supports .csv, .xlsx, .xls</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept=".csv,.xlsx,.xls" 
              />
            </div>
          </div>
        </>
      )
    }
  }

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* Welcome + Date Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome, Richard Davis</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Here's what's happening today.</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => { setDateRange(e.target.value); table.setPageIndex(0) }}
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 outline-none cursor-pointer bg-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statMetrics.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
                <span className="text-2xl font-bold text-slate-900 block tracking-tight">{card.value}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tracking Data Table</h2>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 gap-2 w-44">
              <FaSearch className="text-slate-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); table.setPageIndex(0) }}
                className="bg-transparent text-xs text-slate-600 outline-none w-full"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-6 py-3 font-semibold">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-3 text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">No results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing {startIndex + 1}–{endIndex} of {totalRows} results</p>
            <div className="flex items-center gap-2">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <span className="text-xs text-gray-500">Page {pageIndex + 1} of {table.getPageCount()}</span>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                className="px-3 py-1 text-xs border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Recent Activity</h2>
            <div className="flex flex-col gap-3">
              {activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{item.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "+ Create Diagnostic", type: "diagnostic" },
                { label: "+ Create Contact",    type: "contact"    },
                { label: "Import Templates",    type: "templates"  },
              ].map((action, i) => (
                <button key={i} onClick={() => openModal(action.type)}
                  className="w-full text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 rounded-xl py-2 px-3 transition-colors text-left">
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm px-5 py-3 flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-600">API health</span>
            <span className="text-xs font-bold text-emerald-600 ml-auto">ok</span>
          </div>
        </div>
      </div>

      {/* Completions Trend Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">Completions Trend</h2>
          <span className="text-xs text-gray-400">Total {completionData.reduce((sum, d) => sum + d.completions, 0)}</span>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={completionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
            <Line type="monotone" dataKey="completions" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expiring soon + Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Expiring soon</h2>
          <p className="text-xs text-gray-400">No diagnostics expiring in the next 7 days.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Reminders</h2>
          <div className="flex gap-3">
            <div className="bg-white w-1/2 rounded-2xl border border-gray-100 p-5">
              <h3 className="font-medium text-gray-600 mb-1 text-xs">Due now</h3>
              <p className="text-xs text-gray-400">Nothing due in the next 3 days.</p>
            </div>
            <div className="bg-white w-1/2 rounded-2xl border border-gray-100 p-5">
              <h3 className="font-medium text-gray-600 mb-1 text-xs">Recently reminded</h3>
              <p className="text-xs text-gray-400">No reminders sent in range.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email send failures */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email send failures</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">Created</th>
                <th className="py-3 px-6 font-semibold">Contact</th>
                <th className="py-3 px-6 font-semibold">Template</th>
                <th className="py-3 px-6 font-semibold">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
              {failures.length > 0 ? failures.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 text-slate-900 font-semibold">{row.created}</td>
                  <td className="py-4 px-6 text-slate-500">{row.contact}</td>
                  <td className="py-4 px-6 text-slate-500">{row.template}</td>
                  <td className="py-4 px-6 text-rose-600 font-semibold">{row.error}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-6 px-6 text-slate-400 text-xs">No recent email failures.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Template performance */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Template Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6 font-semibold">Template</th>
                <th className="py-3 px-6 font-semibold">Sent</th>
                <th className="py-3 px-6 font-semibold">Completed</th>
                <th className="py-3 px-6 font-semibold">Completion Rate</th>
                <th className="py-3 px-6 font-semibold">Median Mins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
              {templatePerformance.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 px-6 text-teal-700 font-semibold">{row.template}</td>
                  <td className="py-4 px-6 text-slate-500">{row.sent}</td>
                  <td className="py-4 px-6 text-slate-500">{row.completed}</td>
                  <td className="py-4 px-6 text-slate-500">{row.rate}</td>
                  <td className="py-4 px-6 text-slate-500">{row.median}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="px-6 py-3 text-[10px] font-bold text-slate-400 tracking-wider bg-slate-50/50 border-t border-slate-100 uppercase">
                  SINCE {sinceDateString}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-2xl">
          <ModalHeader className="text-gray-800 font-bold text-base">
            {activeModal && modalConfig[activeModal]?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {activeModal ? modalConfig[activeModal]?.body : <div />}
          </ModalBody>
          <ModalFooter className="gap-2 border-t border-slate-50 mt-4">
            <button onClick={handleClose} className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">Save</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}