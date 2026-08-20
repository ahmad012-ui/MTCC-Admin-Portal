import { useState, useMemo } from "react"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table"
import { FaUsers, FaChartPie, FaSearch, FaEdit, FaTrash, FaUserPlus, FaCheck } from "react-icons/fa"

const domainsData = [
  { id: "1", name: "Context",          description: "Understanding the organisation and its internal/external context.",         diagnostics: 3, status: "Active", created: "4/21/2026" },
  { id: "2", name: "Leadership",       description: "Top management commitment, quality policy and organisational roles.",       diagnostics: 5, status: "Active", created: "4/21/2026" },
  { id: "3", name: "Planning",         description: "Risk assessment, quality objectives and planning for change.",              diagnostics: 4, status: "Active", created: "4/21/2026" },
  { id: "4", name: "Support",          description: "Resources, competence, awareness, communication and documentation.",       diagnostics: 6, status: "Active", created: "4/21/2026" },
  { id: "5", name: "Operation",        description: "Operational planning, production controls and service delivery.",           diagnostics: 7, status: "Active", created: "4/21/2026" },
  { id: "6", name: "Performance Eval", description: "Monitoring, measurement, analysis, internal audit and management review.", diagnostics: 4, status: "Active", created: "4/21/2026" },
  { id: "7", name: "Improvement",      description: "Nonconformity, corrective action and continual improvement processes.",    diagnostics: 3, status: "Active", created: "4/21/2026" },
]

export default function Domains() {
  const { isOpen, onOpen, onClose }     = useDisclosure()
  const [activeModal, setActiveModal]   = useState(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 10 })
  const [form, setForm]                 = useState({ name: "", description: "" })

  const metrics = useMemo(() => ({
    total:            domainsData.length,
    active:           domainsData.filter(d => d.status === "Active").length,
    totalDiagnostics: domainsData.reduce((sum, d) => sum + d.diagnostics, 0)
  }), [])

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-semibold text-teal-700">{getValue()}</span>
      )
    },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "diagnostics", header: "Diagnostics" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100">
          {getValue()}
        </span>
      )
    },
    { accessorKey: "created", header: "Created" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs font-semibold border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            <FaEdit className="w-3 h-3" /> Edit
          </button>
          <button className="px-3 py-1 text-xs font-semibold border border-red-200 text-red-600 bg-red-50/30 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
            <FaTrash className="w-3 h-3" /> Delete
          </button>
        </div>
      )
    },
  ], [])

  const openModal   = (type) => { setActiveModal(type); onOpen() }
  const handleClose = ()     => { onClose(); setActiveModal(null); setForm({ name: "", description: "" }) }
  const handleSave  = ()     => { console.log("Saving domain:", form); handleClose() }

  const table = useReactTable({
    data: domainsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, globalFilter },
  })

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Domains</p>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Organisational Domains</h1>
          <p className="mt-1 text-sm text-slate-500">Define and manage your organisational domains and diagnostic assessments.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => openModal("create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-teal-700 bg-teal-50 rounded-xl border border-teal-100 hover:bg-teal-100/80 transition-colors">
            <FaUserPlus className="w-3 h-3" /> Create Domain
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Domains",      value: metrics.total,            icon: FaUsers,    bg: "bg-blue-50",    color: "text-blue-600"    },
          { label: "Active Domains",     value: metrics.active,           icon: FaCheck,    bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Total Diagnostics",  value: metrics.totalDiagnostics, icon: FaChartPie, bg: "bg-purple-50",  color: "text-purple-600"  },
        ].map((card, i) => {
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Domains List</h2>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 gap-2 w-56">
            <FaSearch className="text-slate-400 w-3 h-3" />
            <input type="text" placeholder="Search domains..."
              value={globalFilter ?? ""}
              onChange={e => setGlobalFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-600 outline-none w-full" />
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
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-3.5 text-slate-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                    No domains found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Page {pagination.pageIndex + 1} of {table.getPageCount()}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 text-slate-600 hover:bg-slate-50 transition-colors">
              Previous
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 text-slate-600 hover:bg-slate-50 transition-colors">
              Next
            </button>
            <select value={pagination.pageSize} onChange={e => table.setPageSize(Number(e.target.value))}
              className="ml-2 text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none bg-white cursor-pointer">
              {[5, 10, 20].map(size => <option key={size} value={size}>{size} rows</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-2xl">
          <ModalHeader className="text-gray-800 font-bold text-base border-b border-slate-100 pb-4">
            {activeModal === "create" ? "Create Domain" : "Edit Domain"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="py-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Leadership"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-teal-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Describe this domain..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-teal-500 transition-colors resize-none" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="gap-2 border-t border-slate-100">
            <button onClick={handleClose}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Save
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )
}