# FoodShare: UN SDG 2 Zero Hunger Surplus Food Redistribution Platform

[![React](https://img.shields.io/badge/React-19.3.1-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.5-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-Native%20Storage-10b981?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![LocalStorage](https://img.shields.io/badge/LocalStorage-Dual--Sync-3b82f6?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Responsive-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![UN SDG 2](https://img.shields.io/badge/UN%20SDG-Goal%202%20Zero%20Hunger-d97706?style=flat)](https://sdgs.un.org/goals/goal2)

FoodShare is a production-grade, offline-first web platform engineered to eliminate local food waste by directly connecting commercial food donors (caterers, banquet halls, restaurants, grocery stores) with verified relief receivers (homeless shelters, soup kitchens, non-profit community pantries).

Powered by a client-side dual-engine persistence layer (**IndexedDB + LocalStorage Real-Time Mirror**) and a native browser **Authentication & Role-Based Access Engine**, the application requires zero external servers to authenticate, store, claim, track, audit, and manage food donations.

---

## 🔗 Live Deployment & Repository Links

* **Live Web Application URL**: `https://your-foodshare-deployment.vercel.app` *(Replace with your deployed URL)*
* **Alternative Mirror (Netlify)**: `https://your-foodshare.netlify.app`
* **GitHub Source Code Repository**: `https://github.com/your-username/foodshare-react`
* **Official SDG Project Report Route**: `/#/report`
* **Administrative Control Panel Route**: `/#/admin`

---

## 🔐 Built-in IndexedDB Authentication & Test Accounts

FoodShare features an offline-first authentication system backed entirely by IndexedDB (`FoodShareAppDB` -> `users` and `sessions` object stores) with automatic LocalStorage synchronization.

Pre-seeded test accounts with verifiable IDs and test keys are available for instant evaluation:

| Persona / Role | Full Name & Title | Email ID | Access Key (Password) | Organization |
|---|---|---|---|---|
| **Administrator** | Sarah Jenkins (Director of Ops) | `admin@foodshare.org` | `admin123` | FoodShare Global Initiative |
| **Food Donor** | Chef Marco Rossi (Executive Chef) | `donor@fresheats.org` | `donor123` | FreshEats Culinary & Catering |
| **NGO Receiver** | Elena Vance (Shelter Director) | `shelter@hope.org` | `shelter123` | Hope Community Relief Shelter |
| **Volunteer Driver** | David Kim (Logistics Lead) | `volunteer@green.org` | `volunteer123` | Green Van Urban Logistics |

### How Authentication Works:
1. **1-Click Test Login**: Click the **Sign In / Test Keys** button in the top navigation bar or user pill to select any pre-configured test account.
2. **Direct Sign In**: Enter any registered email and test key with password reveal capability.
3. **Register New Account**: Register any new user; credentials are encrypted and stored directly into the browser's IndexedDB `users` store.
4. **Admin User Management**: Administrators can inspect all registered users, copy test keys, and add accounts directly in `/#/admin` under the **Users & Test Keys** tab.

---

## 🎯 Problem, Solution & Sustainable Development Goals (SDG)

### 1. The Core Problem Statement
* **Global Paradox**: According to the United Nations Food and Agriculture Organization (FAO), roughly **1.3 billion metric tons of wholesome food** (representing one-third of total global production) is discarded every year. Simultaneously, **828 million people** face chronic hunger and malnutrition.
* **Perishability Bottleneck**: Banquet halls, corporate dining rooms, and grocery retailers frequently generate large quantities of wholesome prepared food that must be collected within a strict 4 to 24-hour window before spoilage.
* **Lack of Direct Coordination**: Food donors currently have no real-time digital discovery channel to notify emergency relief organizations operating within their immediate radius.
* **Environmental Damage**: Decomposing food waste in landfills emits massive volumes of methane gas, which is 28 times more potent than carbon dioxide as a greenhouse pollutant.

### 2. The FoodShare Solution
* **Zero-Latency Client-Side Marketplace**: Donors list food items, quantities, dietary labels, and pickup windows in under 60 seconds.
* **Decentralized Dual-Engine Storage**: Uses browser-native **IndexedDB (`FoodShareAppDB`)** backed by synchronized **LocalStorage** to guarantee 100% offline access, session resilience, and zero server infrastructure costs.
* **Step-by-Step Logistics Tracker**: Shelters claim listings and update progress in real time through verified lifecycle stages: `Available` -> `Pending Pickup` -> `Picked Up` -> `Delivered`.
* **Central Administrative Console**: Complete oversight to inspect records, change statuses inline, audit user actions, export/import JSON database backups, and safely **Clear All Records** or **Restore Mock Data** in one click.

### 3. United Nations SDG Alignment
* **SDG 2: Zero Hunger (Targets 2.1 & 2.2)**: Channels surplus edible meals directly to vulnerable communities, reducing daily caloric deficits.
* **SDG 12: Responsible Consumption and Production (Target 12.3)**: Halves food waste at retail and consumer levels, supporting circular food economies.
* **SDG 13: Climate Action**: Prevents landfill organic decomposition, eliminating approximately 2.5 kg of CO2 equivalent emissions per kilogram of food rescued.

---

## 📸 Website Screenshots & Visual Tour

> **Note for Screenshots**: Place your application screenshots inside `public/screenshots/` matching the filenames below to render them automatically.

### 1. Flagship Project Report & Executive Landing (`/#/report`)
![Hero and Project Report](./public/screenshots/01-project-report.png)
*Displays the comprehensive UN SDG 2 project overview, live database telemetry metrics, problem analysis, and interactive architecture pipeline visual.*

---

### 2. Surplus Food Marketplace & Real-Time Listings (`/#/listings`)
![Food Marketplace Listings](./public/screenshots/02-food-listings.png)
*Live searchable food directory with category pills (Cooked Meals, Produce, Bakery, Dairy, Packaged), expiration countdowns, and direct claim triggers.*

---

### 3. Surplus Food Donation Form (`/#/donor`)
![Food Donation Form](./public/screenshots/03-donor-form.png)
*Donor intake interface with 1-click sample templates (Banquet Catering, Bakery Assortment, Produce Box), quantity calculations, and dietary tag selectors.*

---

### 4. Interactive NGO Food Claim Modal
![Claim Donation Modal](./public/screenshots/04-claim-modal.png)
*Verification dialog allowing relief charities to input organization credentials, emergency phone contact, and pickup arrival estimates.*

---

### 5. NGO Logistics & Delivery Pipeline Dashboard (`/#/dashboard`)
![Receiver Logistics Dashboard](./public/screenshots/05-receiver-dashboard.png)
*Step-by-step progress tracker displaying claimed food transitions (Available -> Pending Pickup -> Picked Up -> Delivered) with status action buttons.*

---

### 6. Central Administrative Control Center (`/#/admin`)
![Admin Control Panel](./public/screenshots/06-admin-overview.png)
*System supervisor hub showing total database records, storage diagnostics, backup export/import utilities, and one-click data reset/wipe tools.*

---

### 7. Administrative Listings Management & Inline Status Changer
![Admin Listings Table](./public/screenshots/07-admin-listings.png)
*Tabular database manager featuring live search, instant status selector dropdowns, edit item dialogs, and deletion confirmations.*

---

### 8. IndexedDB User Management & Authentication Keys (`/#/admin -> Users`)
![Admin User Accounts](./public/screenshots/08-admin-users.png)
*Supervisor interface managing registered accounts, showing masked access keys with reveal/copy tools and 1-click persona switching.*

---

### 9. Cryptographic Audit Activity Trail
![Audit Trail Log](./public/screenshots/09-audit-logs.png)
*Chronological transaction ledger recording timestamps, actors, event tags, and detailed operational messages for full transparency.*

---

## 🛠 Storage API & Operational Methods Reference (`src/db/storage.js`)

All storage methods operate asynchronously using native Promises and automatically maintain synchronization between **IndexedDB** and **LocalStorage**.

| Method Signature | Parameters | Description |
|---|---|---|
| `initializeStorage()` | None | Opens `FoodShareAppDB`, runs migration upgrades, and seeds initial data if empty. |
| `initializeUsers()` | None | Initializes default test users in IndexedDB and creates default admin session. |
| `getAllUsers()` | None | Fetches all registered users from IndexedDB `users` object store. |
| `loginUser(email, key)` | `email, key` | Authenticates user against IndexedDB credentials and establishes session. |
| `registerUser(userData)` | `userData: object` | Adds new user account into IndexedDB `users` store and mirrors to LocalStorage. |
| `logoutUser()` | None | Clears active session from IndexedDB `sessions` and LocalStorage. |
| `getCurrentUser()` | None | Retrieves currently active authenticated user session object. |
| `switchTestAccount(roleOrEmail)` | `roleOrEmail: string` | Switches active session to specified test user in 1 click. |
| `getAllDonations()` | None | Fetches all food donations sorted chronologically from IndexedDB. |
| `getDonationById(id)` | `id: number` | Retrieves a single donation record by ID. |
| `addDonation(itemData)` | `itemData: object` | Adds new listing into IndexedDB & LocalStorage, writes audit log. |
| `updateDonation(id, updates)` | `id: number, updates: object` | Updates fields on an existing donation with audit tracking. |
| `deleteDonation(id)` | `id: number` | Deletes a donation listing from both storage engines. |
| `claimDonation(id, receiverInfo)` | `id: number, receiverInfo: object` | Sets status to `Pending Pickup` and records NGO organization name and phone. |
| `updateDonationStatus(id, newStatus, actor)`| `id: number, newStatus: string, actor: string` | Advances workflow (`Pending Pickup` -> `Picked Up` -> `Delivered`). |
| `clearAllDonations()` | None | **Permanently deletes all food records from IndexedDB and LocalStorage**. |
| `resetToMockData()` | None | **Restores the 6 default SDG 2 Zero Hunger verified demo listings**. |
| `exportDatabaseJSON()` | None | Serializes entire database state and audit logs into a JSON string. |
| `downloadDatabaseBackup(jsonStr)` | `jsonStr: string` | Triggers a browser file download of `foodshare_backup_<timestamp>.json`. |
| `importDatabaseJSON(jsonContent)` | `jsonContent: string \| object` | Validates and restores donations, users, and logs from an external JSON backup. |
| `getAuditLogs()` | None | Retrieves chronological audit trail records (newest first). |
| `clearAuditLogs()` | None | Wipes the audit log store and LocalStorage cache. |
| `getStorageDiagnostics()` | None | Returns active storage engine, record count, and approximate byte size. |

---

## 💻 Key Source Code Architecture

### 1. Dual-Engine Storage Core (`src/db/storage.js`)
```javascript
// Opens native browser IndexedDB with object stores and indexes
export function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('FoodShareAppDB', 2);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('donations')) {
        const store = db.createObjectStore('donations', { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('role', 'role', { unique: false });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('audit_logs')) {
        db.createObjectStore('audit_logs', { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}
```

### 2. Hash-Based Deep Link Router (`src/utils/router.js`)
```javascript
// Clean hash router supporting deep linking, browser back/forward history, and query parameters
export function parseHash() {
  const hash = window.location.hash || '#/report';
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = clean.split('?');
  const segments = pathPart ? pathPart.split('/').filter(Boolean) : [];
  return { route: segments[0] || 'report', query: new URLSearchParams(queryPart || '') };
}
```

---

## 🚀 Getting Started & Local Installation

### Prerequisites
* **Node.js**: Version 18.0 or newer
* **npm**: Version 9.0 or newer

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/foodshare-react.git
   cd foodshare-react
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🌐 Production Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your `foodshare-react` repository.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Click **Deploy**.

### Deploying to Netlify
1. Create a `netlify.toml` file in your root folder:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
2. Connect your Git repository on Netlify and deploy.

### Deploying to GitHub Pages
1. In `vite.config.js`, set `base: '/<repository-name>/'`.
2. Run `npm run build`.
3. Deploy the generated `dist` folder to the `gh-pages` branch.

---

## 📁 Directory Structure

```text
foodshare-react/
├── index.html                   # HTML entry point with SEO metadata and JSON-LD schema
├── package.json                 # Project dependencies, scripts, and engine specifications
├── vite.config.js               # Vite build configuration with React plugin
├── README.md                    # Main project documentation and guide
├── PROJECT_REPORT.md            # Formal comprehensive academic project report
├── public/
│   ├── robots.txt               # Search engine crawler instructions
│   ├── llms.txt                 # AI answer engine and LLM documentation
│   └── screenshots/             # Pre-configured spaces for application screenshots
└── src/
    ├── main.jsx                 # Application entry point, router sync, and state orchestrator
    ├── style.css                # CSS animation tokens, focus rings, and print media rules
    ├── db/
    │   └── storage.js           # IndexedDB + LocalStorage dual-engine API, users, and seed data
    ├── utils/
    │   ├── router.js            # Hash-based URL routing and history hook
    │   └── categoryIcons.jsx    # Lucide SVG category icon utilities and badge renderer
    └── components/
        ├── Navbar.jsx           # Global responsive navigation with auth user pill & switcher
        ├── LoginModal.jsx       # 1-Click test accounts, direct sign in, and registration modal
        ├── Toast.jsx            # Real-time animated notification alerts
        ├── ProjectReport.jsx    # Flagship SDG 2 project overview and telemetry cards
        ├── DonorForm.jsx        # Food donation form with 1-click quick templates & user prefill
        ├── FoodListings.jsx     # Live food marketplace with search, filters, and claim modal
        ├── ReceiverDashboard.jsx# NGO distribution pipeline tracker (Pickup -> Delivered)
        ├── AdminPanel.jsx       # Control center: Clear All, Reset, Export/Import, Users, Logs
        └── Conclusion.jsx       # Feasibility, SDG alignment, references, and future roadmap
```

---

## 📚 Authoritative References & Citations

1. **Food and Agriculture Organization (FAO)**: *The State of Food Security and Nutrition in the World (SOFI Report 2023)*. United Nations, Rome. Available at: `https://www.fao.org/publications/home/sofi/en`
2. **United Nations Environment Programme (UNEP)**: *Food Waste Index Report 2024: Think Eat Save*. UNEP, Nairobi. Available at: `https://www.unep.org/resources/publication/food-waste-index-report-2024`
3. **United Nations Sustainable Development Goals**: *Goal 2: End hunger, achieve food security and improved nutrition and promote sustainable agriculture*. Available at: `https://sdgs.un.org/goals/goal2`
4. **World Wide Web Consortium (W3C)**: *Indexed Database API 3.0: Transactional client-side storage standards for modern web applications*. Available at: `https://www.w3.org/TR/IndexedDB/`

---

## 📄 License & Attribution

This project is licensed under the **MIT License**. Created as an open educational and humanitarian technology platform aligned with the **United Nations Sustainable Development Goals**.
