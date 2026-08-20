import { useState } from "react"
import { FaBell, FaSearch } from "react-icons/fa"
import { Menu, MenuButton, MenuList, MenuItem, Box, Text } from "@chakra-ui/react"

function Navbar() {
  const [search, setSearch] = useState("")
  const [notifications, setNotifications] = useState(3)

  return (
    <div className="h-16 bg-white flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72 gap-2">
          <FaSearch className="text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 outline-none w-full"
          />
        </div>

        <Menu>
          <MenuButton>
            <div className="relative cursor-pointer">
              <FaBell className="text-gray-500 w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="bold">New Diagnostic Report</Text>
                <Text fontSize="xs" color="gray.500">2 hours ago</Text>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="bold">System Maintenance Scheduled</Text>
                <Text fontSize="xs" color="gray.500">1 day ago</Text>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="bold">New User Registered</Text>
                <Text fontSize="xs" color="gray.500">3 days ago</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer">
              RD
            </div>
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  )
}

export default Navbar