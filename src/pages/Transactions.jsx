import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { FaUsers, FaExchangeAlt, FaChartPie, FaCalendarAlt, FaSearch } from "react-icons/fa"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table"
import { transactionData } from "../data/transactions"

// export const transactionData = [
//   { id: "1",  template: "Business Diagnostic v1",        contact: "Sinead Waters",     email: "watersinead2@gmail.com", status: "completed", invited: "5/7/2026",  expires: "6/6/2026",  ttl: 30 },
//   { id: "2",  template: "ISO 9001 Diagnostic (MASTER)",  contact: "Sinead Waters",     email: "watersinead2@gmail.com", status: "invited",   invited: "5/7/2026",  expires: "6/6/2026",  ttl: 30 },
//   { id: "3",  template: "Business Diagnostic v1",        contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "invited",   invited: "4/27/2026", expires: "5/27/2026", ttl: 30 },
//   { id: "4",  template: "ISO 9001 Diagnostic (MASTER)",  contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "invited",   invited: "4/27/2026", expires: "5/27/2026", ttl: 30 },
//   { id: "5",  template: "ISO 9001 Diagnostic (MASTER)",  contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "completed", invited: "4/27/2026", expires: "5/27/2026", ttl: 30 },
//   { id: "6",  template: "ISO 9001 Diagnostic (MASTER)",  contact: "andy brown",        email: "andy@great-circle.co.uk",status: "completed", invited: "4/14/2026", expires: "5/14/2026", ttl: 30 },
//   { id: "7",  template: "Business Diagnostic v1",        contact: "Harri Lloyd-Davies", email: "hld@bevanbuckland.co.uk",status: "invited",  invited: "3/10/2026", expires: "4/9/2026",  ttl: 30 },
//   { id: "8",  template: "Business Diagnostic v1",        contact: "Kevin Bygate",      email: "kevinbygate@sky.com",    status: "completed", invited: "2/18/2026", expires: "3/20/2026", ttl: 30 },
//   { id: "9",  template: "Business Diagnostic v1",        contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "completed", invited: "1/12/2026", expires: "2/11/2026", ttl: 30 },
//   { id: "10", template: "Business Diagnostic v1",        contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "invited",   invited: "1/9/2026",  expires: "2/8/2026",  ttl: 30 },
//   { id: "11", template: "Business Diagnostic v1",        contact: "Jessica Harrington",email: "jessica@mtcc.uk",        status: "completed", invited: "11/12/2025",expires: "12/12/2025",ttl: 30 },
//   { id: "12", template: "ISO 9001 Diagnostic (MASTER)",  contact: "Joel Test",          email: "joel@parfitt@zpee.app",  status: "invited",   invited: "10/19/2025",expires: "11/18/2025",ttl: 30 },
// ]

const template = [
  { id: "1", name: "Business Diagnostic v1" },
  { id: "2", name: "ISO 9001 Diagnostic (MASTER)" },
]

const contacts = [
  { id: "1", name: "Sinead Waters" },
  { id: "2", name: "Jessica Harrington" },
  { id: "3", name: "andy brown" },
  { id: "4", name: "Harri Lloyd-Davies" },
  { id: "5", name: "Kevin Bygate" },
  { id: "6", name: "Joel Test" },
]

const ttlOptions = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
]
// ─── 2. STATUS BADGE CHILD COMPONENT ─────────────────────────────────
function StatusBadge({ status }) {
  const isCompleted = status === "completed"
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide capitalize border ${isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
      {status}
    </span>
  )
}

// ─── 3. MAIN PAGE CONTAINER COMPONENT ────────────────────────────────
function Transactions() {
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [activeModal, setActiveModal] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const modalConfig = {
    transaction: {
      title: "Create Transaction",
      body: (
        <div className="space-y-4 text-sm text-slate-700">
          <p className="text-xs uppercase tracking-wider text-slate-400">New transaction details</p>
          <div className="grid gap-3">
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-400"
              defaultValue=""
            >
              <option value="">Select a template</option>
              {template.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-400"
              defaultValue=""
            >
              <option value="">Select a contact</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 outline-none focus:border-teal-400"
              defaultValue=""
            >
              <option value="">Select TTL</option>
              {ttlOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
  }

  const openModal = (type) => {
    setActiveModal(type)
    onOpen()
  }

  const handleClose = () => {
    setActiveModal(null)
    onClose()
  }

  const handleSave = () => {
    console.log("Saved modal action for:", activeModal)
    handleClose()
  }

  // KPI calculations derived cleanly from database array
  const metrics = useMemo(() => {
    const total = transactionData.length
    const completed = transactionData.filter(t => t.status === "completed").length
    return {
      total,
      completed,
      invited: total - completed
    }
  }, [])

  // Columns definition must live inside the component to render hooks/actions cleanly
  const columns = useMemo(() => [
    { 
      accessorKey: "template", 
      header: "Template",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.original.template}</span>
          <span className="text-[10px] text-slate-400 font-normal">TTL: {row.original.ttl} days</span>
        </div>
      )
    },
    { 
      accessorKey: "contact",  
      header: "Recipient / Contact",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{row.original.contact}</span>
          <span className="text-[11px] text-slate-400 font-normal">{row.original.email}</span>
        </div>
      )
    },
    { accessorKey: "status",   header: "Status",  cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: "invited",  header: "Invited Date"  },
    { accessorKey: "expires",  header: "Expires Date"  },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === "completed" && (
            <button onClick={() => navigate(`/reports/${row.original.id}`)} className="px-3 py-1 text-xs font-semibold border border-teal-200 text-teal-600 bg-teal-50/30 rounded-lg hover:bg-teal-50 transition-colors">
              Open
            </button>
          )}
          <button onClick={() => console.log("Resending payload to:", row.original.email)} className="px-3 py-1 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Resend
          </button>
          <button onClick={() => console.log("Deleting transaction ID:", row.original.id)}
            className="px-3 py-1 text-xs font-semibold border border-red-200 text-red-600 bg-red-50/30 rounded-lg hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      )
    },
  ], [])

  const table = useReactTable({
    data: transactionData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(), 
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      globalFilter,
    },
  })

  return (
    <div className="flex flex-col gap-6 w-full font-sans min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Trackiam Master Log
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">
            Monitor client diagnostic execution sequences, timelines, and status
            logs.
          </p>
        </div>
        <div>
          {[{ label: "+ Create Transaction", type: "transaction" }].map(
            (action, i) => (
              <button
                key={i}
                onClick={() => openModal(action.type)}
                className="w-full text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 rounded-xl py-2 px-3 transition-colors text-left"
              >
                {action.label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Dynamic Summary Cards Layout */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Diagnostic Log entries", count: metrics.total, icon: <FaExchangeAlt />, bg: "bg-blue-50/60", text: "text-blue-700", border: "border-blue-100/80" },
          { label: "Completed Evaluations", count: metrics.completed, icon: <FaChartPie />, bg: "bg-emerald-50/60", text: "text-emerald-700", border: "border-emerald-100/80" },
          { label: "Pending Invitations", count: metrics.invited, icon: <FaUsers />, bg: "bg-amber-50/60", text: "text-amber-700", border: "border-amber-100/80" },
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-xl border ${card.bg} ${card.border} shadow-sm flex items-center justify-between`}>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
              <span className={`text-2xl font-bold tracking-tight block mt-1 ${card.text}`}>{card.count}</span>
            </div>
            <div className={`text-lg ${card.text} opacity-60`}>{card.icon}</div>
          </div>
        ))}
      </div> */}

      {/* Main Table Interface Grid Component */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-100 gap-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Transaction Ledger
          </h2>

          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
              <FaSearch />
            </div>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by template or contact..."
              className="w-full text-xs font-medium pl-9 pr-4 py-2 text-slate-700 border border-slate-200 rounded-xl outline-none focus:border-teal-500 transition-colors bg-slate-50/50"
            />
          </div>
        </div>

        {/* Render Workspace Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-3.5 font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3.5 text-slate-600">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-slate-400 font-medium"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Table Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-400 font-medium">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>

            <select
              value={pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="ml-2 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none bg-white font-medium cursor-pointer"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
  );
}

export default Transactions