# 🏢 MTCC Admin Portal

> A modern, responsive admin dashboard for the **My Virtual Consultant** diagnostic platform — built with React, Tailwind CSS, and love. ☕

---

## ✨ What's Inside

| Page | Description |
|------|-------------|
| 📊 **Dashboard** | Real-time stats, activity feed, completion trends |
| 👥 **Contacts** | Manage your contact directory |
| 🔄 **Transactions** | Send and track diagnostic invitations |
| 📋 **Diagnostics** | Create and manage diagnostic templates |
| 📈 **Reports** | Visual radar charts and detailed response analysis |
| 🗂️ **Groups** | Organise contacts into assessment groups |
| 🌐 **Domains** | Manage organisational diagnostic domains |

---

## 🛠️ Built With

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ChakraUI](https://img.shields.io/badge/Chakra--UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)

- ⚛️ **React** — UI framework
- 🎨 **Tailwind CSS v3** — Utility-first styling
- 🧩 **Chakra UI** — Modal and overlay components
- 📊 **Recharts** — Line charts and radar charts
- 📋 **TanStack Table** — Powerful data tables
- 🔀 **React Router** — Client-side navigation
- 🎯 **React Icons** — Icon library

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** installed on your machine.

```bash
node -v   # should be v14 or higher
npm -v    # should be v6 or higher
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mtcc-platform.git

# 2. Navigate to project folder
cd mtcc-platform

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### 🌐 Open in Browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
mtcc-platform/
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Layout.jsx        ← App shell (sidebar + navbar)
│   │   ├── Sidebar.jsx       ← Navigation sidebar
│   │   └── Navbar.jsx        ← Top bar
│   │
│   ├── 📂 pages/
│   │   ├── Dashboard.jsx     ← Main dashboard
│   │   ├── Contacts.jsx      ← Contact management
│   │   ├── Transactions.jsx  ← Transaction tracking
│   │   ├── Reports.jsx       ← Diagnostic reports
│   │   ├── Diagnostics.jsx   ← Template management
│   │   ├── Groups.jsx        ← Group management
│   │   └── Domains.jsx       ← Domain management
│   │
│   ├── 📂 data/
│   │   └── transactions.js   ← Shared data
│   │
│   ├── App.jsx               ← Routes
│   └── index.css             ← Global styles
│
├── package.json
└── README.md
```

---

## 🎯 Key Features

- 🔍 **Live search** — Filter table data in real time
- 📅 **Date range filter** — View data by last 7, 30, or 90 days
- 📄 **Pagination** — Navigate large datasets easily
- 📊 **Radar chart** — Visual diagnostic scoring
- 📈 **Line chart** — Completion trends over time
- 🪟 **Modals** — Create, import, and manage records
- 📱 **Responsive** — Works on desktop and mobile
- 🏷️ **Status badges** — Visual status indicators

---

## 🔮 Coming Soon

- [ ] 🔥 Firebase Firestore integration
- [ ] 🔐 Firebase Authentication (login page)
- [ ] 📤 Export CSV / PDF functionality
- [ ] 📱 Mobile sidebar toggle
- [ ] 📧 Email sending via API

---

## 👨‍💻 Developer

Built with ☕ and a lot of debugging by **Ahmad**
> *Started from zero React knowledge. Finished with a full production-ready admin portal.*

---

## 📄 License

This project is private and built for **My Virtual Consultant (MTCC)**.
Not for public distribution.
