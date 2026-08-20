import { useState, useMemo, useRef } from "react"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table"
import { FaUsers, FaChartPie, FaExchangeAlt, FaCalendarAlt, FaSearch, FaUpload, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa"

const diagnosticsData = [
  { id: "1", name: "PACE ChangeReadiness Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "2", name: "CustomerSatisfaction Maturity Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "3", name: "WorkplaceCulture Maturity Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "4", name: "BS65000 Maturity Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "5", name: "HealthInBuildings Maturity Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "6", name: "ISO14001 Maturity Diagnostic (MASTER)", type: "BUSINESS", version: 1, status: "Active", created: "4/21/2026" },
  { id: "7", name: "ISO 9001 Diagnostic (MASTER)", type: "ISO 9001", version: 1, status: "Active", created: "4/21/2026" },
  { id: "8", name: "Business Diagnostic", type: "BUSINESS", version: 1, status: "Active", created: "11/12/2025" },
  { id: "9", name: "ISO 9001 Diagnostic", type: "ISO 9001", version: 1, status: "Active", created: "10/19/2025" },
  { id: "10", name: "ISO 14001 Diagnostic", type: "ISO 14001", version: 1, status: "Active", created: "9/15/2025" },
  { id: "11", name: "Customer Satisfaction Diagnostic", type: "BUSINESS", version: 1, status: "Active", created: "8/10/2025" },
  { id: "12", name: "Workplace Culture Diagnostic", type: "BUSINESS", version: 1, status: "Active", created: "7/5/2025" },
  { id: "13", name: "BS65000 Diagnostic", type: "BUSINESS", version: 1, status: "Active", created: "6/1/2025" },
]

const typeOptions = ["Business", "ISO 9001", "ISO 14001"]

function TypeBadge({ type }) {
  const styles = {
    "BUSINESS": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "ISO 9001":  "bg-blue-50 text-blue-700 border-blue-100",
    "ISO 14001": "bg-purple-50 text-purple-700 border-purple-100",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${styles[type] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
      {type}
    </span>
  )
}

function InputField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500 transition-colors"
      />
    </div>
  )
}

export default function Diagnostics() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeModal, setActiveModal] = useState(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [exportOpen, setExportOpen] = useState(null)
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [form, setForm] = useState({ name: "", type: "Business", version: "1" })

  const openModal = (type) => { setActiveModal(type); onOpen() }
  const handleClose = () => { setActiveModal(null); onClose(); setForm({ name: "", type: "Business", version: "1" }) }
  const handleSave = () => { console.log("Saving diagnostic:", form); handleClose() }

  const metrics = useMemo(() => ({
    total: diagnosticsData.length,
    business: diagnosticsData.filter(d => d.type === "BUSINESS").length,
    iso: diagnosticsData.filter(d => d.type !== "BUSINESS").length,
  }), [])

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-semibold text-teal-700 hover:underline cursor-pointer">{getValue()}</span>
      )
    },
    {
      accessorKey: "type",
      header: "Diagnostic Type",
      cell: ({ getValue }) => <TypeBadge type={getValue()} />
    },
    { accessorKey: "version", header: "Version" },
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
          <div className="relative">
            <button
              onClick={() => setExportOpen(exportOpen === row.original.id ? null : row.original.id)}
              className="px-3 py-1 text-xs font-semibold border border-teal-200 text-teal-600 bg-teal-50/30 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1"
            >
              Export <FaChevronDown className="w-2.5 h-2.5" />
            </button>
            {exportOpen === row.original.id && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-lg z-10 min-w-32 overflow-hidden">
                {["Export CSV", "Export Excel", "Export PDF"].map(opt => (
                  <button key={opt} onClick={() => { console.log(opt, row.original.id); setExportOpen(null) }}
                    className="w-full px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 text-left transition-colors">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="px-3 py-1 text-xs font-semibold border border-red-200 text-red-600 bg-red-50/30 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1">
            <FaTrash className="w-3 h-3" /> Delete
          </button>
        </div>
      )
    },
  ], [exportOpen])

  const table = useReactTable({
    data: diagnosticsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: { pagination, globalFilter },
  })

  const modalConfig = {
    create: {
      title: "Create Diagnostic",
      body: (
        <>
          <InputField label="Diagnostic Name" placeholder="e.g. Business Diagnostic"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-teal-500">
              {typeOptions.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <InputField label="Version" type="number" placeholder="e.g. 1"
            value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} />
        </>
      )
    },
    import: {
      title: "Import Diagnostic from CSV/Excel",
      body: (
        <>
          <p className="text-xs text-slate-400 mb-4">Supported formats: .csv, .xlsx, .xls</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-teal-400 transition-colors cursor-pointer bg-slate-50/50"
          >
            {selectedFile ? (
              <div>
                <p className="text-sm font-semibold text-emerald-600">Selected:</p>
                <p className="text-xs text-gray-600 font-mono mt-1">{selectedFile.name}</p>
                <p className="text-[10px] text-gray-400 mt-2">Click to change file</p>
              </div>
            ) : (
              <>
                <FaUpload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">.csv, .xlsx, .xls</p>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </div>
        </>
      )
    }
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Diagnostics</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Manage diagnostic templates and question banks.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => openModal("import")}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FaUpload className="w-3 h-3" /> Import CSV/Excel
          </button>
          <button onClick={() => openModal("create")}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors">
            + Create Diagnostic
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Diagnostics", value: metrics.total,    icon: FaUsers,       bg: "bg-blue-50",    color: "text-blue-600" },
          { label: "Business Type",     value: metrics.business, icon: FaChartPie,    bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "ISO Type",          value: metrics.iso,      icon: FaExchangeAlt, bg: "bg-purple-50",  color: "text-purple-600" },
          { label: "Draft Templates",   value: 2,               icon: FaCalendarAlt, bg: "bg-amber-50",  color: "text-amber-600" },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
                <span className={`text-2xl font-bold text-slate-900 block tracking-tight`}>{card.value}</span>
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
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Diagnostics List</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 gap-2 w-56">
              <FaSearch className="text-slate-400 w-3 h-3" />
              <input type="text" placeholder="Search diagnostics..."
                value={globalFilter ?? ""}
                onChange={e => setGlobalFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-600 outline-none w-full" />
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold text-teal-600 border border-teal-200 bg-teal-50/30 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1">
              Export All <FaChevronDown className="w-2.5 h-2.5" />
            </button>
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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/40 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-3.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-400">
                    No diagnostics found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
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

      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent className="rounded-2xl">
          <ModalHeader className="text-gray-800 font-bold text-base border-b border-slate-100 pb-4">
            {activeModal && modalConfig[activeModal]?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="py-6">
            {activeModal && modalConfig[activeModal]?.body}
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