import React, { useMemo, useState, useRef } from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { FaUsers, FaChartPie, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa"

const contactData = [
  { name: "John Doe", email: "john@example.com", date: "2023-01-15", status: "Active" },
  { name: "Jane Smith", email: "jane@example.com", date: "2023-02-20", status: "Active" },
  { name: "Bob Johnson", email: "bob@example.com", date: "2023-03-10", status: "Inactive" },
  { name: "Alice Walker", email: "alice.walker@example.com", date: "2023-04-02", status: "Active" },
  { name: "Brian Cooper", email: "brian.cooper@example.com", date: "2023-04-18", status: "Active" },
  { name: "Catherine Lee", email: "catherine.lee@example.com", date: "2023-05-05", status: "Inactive" },
  { name: "David Kim", email: "david.kim@example.com", date: "2023-05-22", status: "Active" },
  { name: "Eva Green", email: "eva.green@example.com", date: "2023-06-10", status: "Active" },
  { name: "Frank Moore", email: "frank.moore@example.com", date: "2023-06-28", status: "Inactive" },
  { name: "Grace Park", email: "grace.park@example.com", date: "2023-07-12", status: "Active" },
  { name: "Hector Ruiz", email: "hector.ruiz@example.com", date: "2023-07-30", status: "Active" },
  { name: "Ivy Chen", email: "ivy.chen@example.com", date: "2023-08-15", status: "Inactive" },
  { name: "Jackie Brown", email: "jackie.brown@example.com", date: "2023-09-01", status: "Active" },
  { name: "Kyle Patel", email: "kyle.patel@example.com", date: "2023-09-18", status: "Active" },
  { name: "Luna Sanchez", email: "luna.sanchez@example.com", date: "2023-10-04", status: "Inactive" },
  { name: "Marcus Hill", email: "marcus.hill@example.com", date: "2023-10-20", status: "Active" },
  { name: "Nina Ford", email: "nina.ford@example.com", date: "2023-11-05", status: "Active" },
  { name: "Owen Scott", email: "owen.scott@example.com", date: "2023-11-22", status: "Inactive" },
  { name: "Paula Diaz", email: "paula.diaz@example.com", date: "2023-12-08", status: "Active" },
  { name: "Quentin Young", email: "quentin.young@example.com", date: "2024-01-02", status: "Active" },
  { name: "Rita Bell", email: "rita.bell@example.com", date: "2024-01-19", status: "Inactive" },
  { name: "Samir Khan", email: "samir.khan@example.com", date: "2024-02-04", status: "Active" },
  { name: "Tara O'Neil", email: "tara.oneil@example.com", date: "2024-02-20", status: "Active" },
  { name: "Umar Ali", email: "umar.ali@example.com", date: "2024-03-08", status: "Inactive" },
  { name: "Vera Novak", email: "vera.novak@example.com", date: "2024-03-25", status: "Active" },
  { name: "Wesley Ford", email: "wesley.ford@example.com", date: "2024-04-10", status: "Active" },
  { name: "Ximena Lopez", email: "ximena.lopez@example.com", date: "2024-04-28", status: "Inactive" },
  { name: "Yusuf Kareem", email: "yusuf.kareem@example.com", date: "2024-05-15", status: "Active" },
  { name: "Zoe Hart", email: "zoe.hart@example.com", date: "2024-05-30", status: "Active" },
  { name: "Aaron Blake", email: "aaron.blake@example.com", date: "2024-06-12", status: "Active" },
  { name: "Bethany Cruz", email: "bethany.cruz@example.com", date: "2024-06-29", status: "Inactive" },
]

export default function Contacts() {
  const totalContacts = contactData.length
  const activeCount = useMemo(() => contactData.filter(c => c.status === "Active").length, [])
  const inactiveCount = totalContacts - activeCount
  const recentCount = totalContacts

  // ─── CHAKRA DISCLOSURE & STATE MANAGEMENT ─────────────────────────
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [activeModal, setActiveModal] = useState(null)
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" })
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleDropzoneClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0]
    if (f) {
      setSelectedFile(f)
      console.log("Selected file ready for import:", f.name)
    }
  }

  const openModal = (type) => {
    setActiveModal(type)
    onOpen()
  }

  const handleClose = () => {
    onClose()
    setActiveModal(null)
    setContactForm({ name: "", phone: "", email: "" }) // Resets state values safely
  }

  const handleSave = () => {
    console.log(`--- Saving Action for Action Mode: "${activeModal}" ---`)
    if (activeModal === "contact") {
      console.log("Saving Contact Data Submitting to DB:", contactForm)
      // Future API Call: axios.post('/api/contacts', contactForm)  
    }
    handleClose()
  }

  // ─── TANSTACK TABLE LOGIC ─────────────────────────────────────────
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'date', header: 'Date' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
            status === 'Active' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
              : 'bg-slate-50 text-slate-500 border border-slate-100'
          }`}>
            {status}
          </span>
        )
      }
    }
  ], [])

  const table = useReactTable({
    data: contactData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  const modalConfig = {
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
    }
    ,
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
    <div className="flex flex-col gap-6 w-full font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Contacts</h1>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Manage and organize your master database directory.</p>
        </div>
        <div>
          <button 
            onClick={() => openModal("contact")}
            className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-100 rounded-xl py-2.5 px-4 transition-colors">
            + Create Contact
          </button>
        </div>
      </div>

      {/* Metrics panel row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Contacts", count: totalContacts, icon: FaUsers, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active", count: activeCount, icon: FaChartPie, bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Inactive", count: inactiveCount, icon: FaExchangeAlt, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Recent Entries", count: recentCount, icon: FaCalendarAlt, bg: "bg-purple-50", color: "text-purple-600" },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
                <span className={`text-2xl font-bold text-slate-900 block tracking-tight`}>{card.count}</span>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid Wrapper */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Directory Management Table</h2>
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
                    <td key={cell.id} className="px-6 py-3 text-slate-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
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
              {[5, 10, 20].map(size => (
                <option key={size} value={size}>{size} rows</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(3px)" />
        <ModalContent className="rounded-2xl" border="1px" borderColor="slate.100 shadow-xl">
          <ModalHeader className="text-gray-800 font-bold text-xs uppercase tracking-wider border-b border-slate-50/60 py-4 px-6">
            {activeModal && modalConfig[activeModal]?.title}
          </ModalHeader>
          <ModalCloseButton className="top-3 right-4 text-gray-400 hover:text-gray-600" />
          
          <ModalBody className="py-6 px-6">
            {activeModal ? modalConfig[activeModal]?.body : <div />}
          </ModalBody>
          
          <ModalFooter className="gap-2 border-t border-slate-50/80 bg-slate-50/30 px-6 py-3">
            <button onClick={handleClose} className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 text-xs font-semibold bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
              Save Contact
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )
}