import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Contacts from "./pages/Contacts"
import Transactions from "./pages/Transactions"
import Diagnostics from "./pages/Diagnostics"
import Domain from "./pages/Domain"
import Reports from "./pages/Reports"
import Groups from "./pages/Groups"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Pages inside layout */}
            <Route index element={<Dashboard />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="domain" element={<Domain />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports/:id" element={<Reports />} />
            <Route path="groups" element={<Groups />} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App