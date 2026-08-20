import { Link, useLocation } from "react-router-dom"
import logo from "../assets/logo.png"
import { FaChartPie, FaAddressBook, FaExchangeAlt, FaStethoscope, FaGlobe, FaFileAlt, FaUsers } from "react-icons/fa"
import { Menu, MenuButton, MenuList, MenuItem, Box, Text } from "@chakra-ui/react"

function Sidebar() {
  const location = useLocation()

  const navItems = [
    { name: "Dashboard", path: "/", icon: FaChartPie },
    { name: "Contacts", path: "/contacts", icon: FaAddressBook },
    { name: "Transactions", path: "/transactions", icon: FaExchangeAlt },
    { name: "Diagnostics", path: "/diagnostics", icon: FaStethoscope },
    { name: "Domain", path: "/domain", icon: FaGlobe },
    { name: "Reports", path: "/reports", icon: FaFileAlt },
    { name: "Groups", path: "/groups", icon: FaUsers },
  ]

  return (
    <div className="w-64 h-screen sticky top-0 bg-[#F8F9FA] text-slate-700 flex flex-col justify-between border-r border-slate-200/80 shadow-[1px_0_10px_rgba(0,0,0,0.03)] overflow-y-auto">
      <div className="flex flex-col p-5">
        <div className="flex items-center justify-center">
          <img src={logo} alt="MTCC Logo" className="h-16 object-contain" />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 font-semibold"
                    : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 mr-4 transition-colors duration-200 ${
                    isActive
                      ? "text-gray-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span
                  className={`transform transition-transform duration-200 ${!isActive && "group-hover:translate-x-1"}`}
                >
                  {item.name}
                </span>

                {isActive && (
                  <span className="ml-auto text-grey-400 font-bold text-xs">
                    ➔
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <Menu>
        <MenuButton>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              RD
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-slate-800 truncate">
                Richard Davis
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Admin
              </span>
            </div>
          </div>
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default Sidebar