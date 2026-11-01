# Share The Bite: UN SDG 2 Zero Hunger Surplus Food Redistribution Platform

[![React](https://img.shields.io/badge/React-19.3.1-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.5-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-Native%20Browser%20DB-10b981?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![LocalStorage](https://img.shields.io/badge/LocalStorage-Dual--Engine%20Sync-3b82f6?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Responsive-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![UN SDG 2](https://img.shields.io/badge/UN%20SDG-Goal%202%20Zero%20Hunger-d97706?style=flat)](https://sdgs.un.org/goals/goal2)

**Share The Bite** is a production-grade, offline-first web platform engineered to eliminate commercial food waste by directly connecting food donors (restaurants, hotels, banquet halls, bakeries, grocers, and private households) with community relief providers (homeless shelters, soup kitchens, food pantries, and low-income families).

The platform is designed around **5 Core Operational Pillars** with **1 Single Login System (Admin Login Only)** and a **Dual-Engine Persistence Architecture** (**IndexedDB** as primary transactional storage + **LocalStorage** as real-time mirror), requiring zero external backend infrastructure to operate.

---

## 🏛 The 5 Core Application Pillars

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Share The Bite Architecture                               │
├─────────────────────┬─────────────────────┬───────────────────┬────────────────────────┤
│ 1. Home Page        │ 2. All Products     │ 3. Donor Form     │ 4. Admin Control Panel │
│    & Latest Surplus │    & Requests       │    (Public Intake)│    (Both-Sides Dispatch)│
│    Preview          │    Directory        │                   ├────────────────────────┤
│                     │                     │                   │ 5. Admin Login ONLY    │
└─────────────────────┴─────────────────────┴───────────────────┴────────────────────────┘
```

1. **1st: Home Page (`#/home`)**: Modern landing with community impact metrics, latest donor surplus products showcase with quick "Request Food" triggers, 3-step operational blueprint, and UN SDG 2 commitment.
2. **2nd: All Products Directory (`#/listings`)**: Full marketplace of all surplus food batches with live search, category filtering (Cooked Meals, Produce, Bakery, Dairy, Packaged), and the comprehensive **Receiver Food Request Application Modal**.
3. **3rd: Public Donor Intake Form (`#/donor`)**: Open public donation form where anyone can donate without an account or login. Donors input item description, quantity, portions, donor type, contact phone, email, pickup address, expiry with shortcuts, dietary tags, and handling notes.
4. **4th: Central Admin Control Panel (`#/admin`)**: Unified operations console managing service requests from both sides (Donor Offer specs vs. Receiver Application specs) with full lifecycle actions: **Accept Request**, **Reject Request** (with reason & auto-reset to Available), **Dispatch Out for Pickup**, **Confirm Picked Up**, **Dispatch Out for Delivery**, **Confirm Delivered**, status overrides, database backup utilities, and audit trail.
5. **5th: The Admin Login ONLY**: A single, clean login system for the administrator only. Public donors and receivers do not need an account or password to donate or apply for food.

---

## 🔗 Live Deployment & Repository Links

* **Live Web Application URL**: `https://sharethebite.vercel.app` *(Replace with your live deployment URL)*
* **Alternative Mirror (Netlify)**: `https://sharethebite.netlify.app`
* **GitHub Source Code Repository**: `https://github.com/your-username/foodshare-react`
* **Comprehensive Project Report**: `PROJECT_REPORT.md` (and in-app at `/#/report`)
* **Administrative Control Panel Route**: `/#/admin`

---

## 🔐 The Admin Login ONLY (Single Login System)

To eliminate user confusion, **Share The Bite** uses a single authentication gateway exclusively for the System Administrator. Donors and relief shelters access all public pages, browse products, submit donations, and file relief applications without creating accounts or passwords.

### Administrator Test Credentials (Stored in IndexedDB):

| Role | Name | Email Address | Access Key (Password) | Organization |
|---|---|---|---|---|
| **Administrator** | Sarah Jenkins | `admin@foodshare.org` | `admin123` | Share The Bite Global Initiative |

### Authentication Features:
1. **1-Click Demo Admin Sign In**: Click **"Admin Login"** in the top navigation bar and select **"1-Click Demo Admin Sign In"** for immediate evaluation without typing.
2. **Manual Key Input**: Enter `admin@foodshare.org` and `admin123` with password reveal toggle.
3. **Role Enforcement**: If a user attempts to access `/#/admin` without signing in, a security gate presents the credentials and 1-click sign-in button.
4. **Sign Out**: Clicking **Sign Out** clears the active session from IndexedDB `sessions` store and LocalStorage.

---

## 🎯 Problem, Solution & Sustainable Development Goals (SDG)

### 1. The Core Problem Statement
* **Global Food Loss**: According to the UN Food and Agriculture Organization (FAO), over **1.3 billion metric tons of food** is wasted globally each year, while **828 million people** face severe food insecurity and hunger.
* **Tight Perishability Window**: Prepared catering, hotel buffets, and artisan bakery products remain safe to consume for only 4 to 24 hours. Traditional telephone calls and ad-hoc networks fail to coordinate transport before spoilage occurs.
* **Lack of Direct Coordination**: Food donors currently have no discovery channel to notify emergency relief organizations operating within their immediate geographical radius.
* **Environmental Harm**: Decomposing food waste in landfills generates methane gas ($CH_4$), a greenhouse gas 28 times more potent than carbon dioxide ($CO_2$).

### 2. The Share The Bite Solution
* **Zero-Barrier Public Intake**: Any hospitality business or individual can post surplus meals in under 60 seconds without creating an account.
* **Structured Receiver Applications**: Shelters and charities submit detailed relief applications specifying beneficiary counts, delivery addresses, vehicle types, and timing urgency.
* **Two-Sided Admin Management**: System administrators view both sides of every request (Donor Offer specs + Receiver Application specs) to authorize claims, dispatch drivers, and verify handover.
* **Decentralized Dual-Engine Storage**: Uses native browser **IndexedDB (`FoodShareAppDB`)** paired with a real-time **LocalStorage** mirror for offline resilience and zero backend server costs.

### 3. United Nations SDG Alignment
* **SDG 2: Zero Hunger (Targets 2.1 & 2.2)**: Channels surplus edible food directly to hungry individuals, soup kitchens, and orphanages.
* **SDG 12: Responsible Consumption and Production (Target 12.3)**: Contributes to halving per capita global food waste at retail and consumer levels.
* **SDG 13: Climate Action**: Prevents landfill methane emissions by diverting organic waste into human consumption (approx. 2.5 kg $CO_2e$ saved per kg of food rescued).

---

## 🔄 Service Requests & Logistics Lifecycle

Share The Bite tracks surplus food through an operational lifecycle:

$$\text{Available} \xrightarrow[\text{Public Intake}]{\text{Donor Form}} \text{Listed} \xrightarrow[\text{Application Form}]{\text{Receiver Apply}} \text{Requested} \xrightarrow[\text{Admin Accept/Reject}]{\text{Review}} \begin{cases} \text{Request Accepted} \rightarrow \text{Out for Pickup} \rightarrow \text{Picked Up} \rightarrow \text{Out for Delivery} \rightarrow \text{Delivered} \\ \text{Request Rejected (Reset to Available)} \end{cases}$$

1. **Available**: Public donor lists food parcel. Displays on Home Page and All Products directory.
2. **Requested**: Receiver/shelter clicks "Request Food" and submits the application form. Status updates to `Requested`.
3. **Request Accepted / Rejected**:
   - **Accept Request**: Admin approves the application; status updates to `Request Accepted`.
   - **Reject Request**: Admin declines with reason (e.g. outside delivery radius); **item automatically resets to `Available`** so other shelters can apply.
4. **Out for Pickup**: Admin assigns driver and vehicle details.
5. **Picked Up**: Driver confirms food collection from donor.
6. **Out for Delivery**: Food is en route to the shelter.
7. **Delivered & Verified**: Driver and shelter confirm delivery handover with signature verification; rescued portions are added to the community total.

---

## 📸 Website Screenshots & Visual Tour

> **Note for Screenshots**: Place your application screenshots inside `public/screenshots/` matching the filenames below to render them automatically.

### 1. Home Page & Latest Products Preview (`/#/home`)
![Home Page & Hero Showcase](./public/screenshots/01-home-page.png)
*Figure 1: Home page featuring the Share The Bite hero section, real-time community counters, latest surplus food preview, and 3-step operational blueprint.*

---

### 2. All Products Directory & Marketplace (`/#/listings`)
![All Products Directory](./public/screenshots/02-all-products.png)
*Figure 2: Complete catalog of surplus food products with live search, category filter pills (Cooked Meals, Produce, Bakery, Dairy, Packaged), and status tags.*

---

### 3. Public Donor Intake Form (`/#/donor`)
![Public Donor Intake Form](./public/screenshots/03-donor-form.png)
*Figure 3: Open public food intake form with 1-click sample templates (Banquet, Bakery, Produce, Pantry), expiry shortcuts, and dietary tags without login.*

---

### 4. Receiver Food Request Application Modal
![Receiver Food Request Modal](./public/screenshots/04-receiver-modal.png)
*Figure 4: Comprehensive relief request form allowing shelters to enter recipient organization, contact person, phone, delivery address, beneficiaries count, urgency, and vehicle mode.*

---

### 5. Central Admin Control Panel: Two-Sided Request Dossier (`/#/admin`)
![Admin Two-Sided Request Dossier](./public/screenshots/05-admin-dossier.png)
*Figure 5: Side-by-side comparison of Donor Offer Specifications vs. Receiver Application Details with Accept, Reject, Pickup, and Delivery action buttons.*

---

### 6. Admin Rejection Modal with Automatic Reset
![Admin Rejection Modal](./public/screenshots/06-admin-reject.png)
*Figure 6: Rejection dialogue with preset reasons that safely declines the request and resets the listing back to "Available" for other charities.*

---

### 7. Dual-Engine Storage Diagnostics & Database Backup Hub (`/#/admin -> Database`)
![Database & Backup Hub](./public/screenshots/07-admin-database.png)
*Figure 7: Storage center featuring Restore Demo Data, Clear All Data, JSON export, and JSON import tools.*

---

### 8. System Activity Audit Log Trail (`/#/admin -> Audit`)
![System Audit Trail](./public/screenshots/08-audit-trail.png)
*Figure 8: Chronological event ledger recording every donation, application, status transition, and admin action with actor stamps.*

---

### 9. Dedicated Admin Login Modal
![Admin Login Only Modal](./public/screenshots/09-admin-login.png)
*Figure 9: The single authentication dialog featuring email/key inputs and 1-click demo administrator sign in.*

---

## 🛠 Storage API & Operational Methods Reference (`src/db/storage.js`)

All storage methods operate asynchronously using Promises and maintain synchronization between **IndexedDB** (`FoodShareAppDB`) and **LocalStorage**.

| Method Signature | Parameters | Description |
|---|---|---|
| `initializeStorage()` | None | Opens `FoodShareAppDB`, runs migration upgrades, and seeds initial data if empty. |
| `getAllDonations()` | None | Fetches all food donations sorted chronologically from IndexedDB. |
| `getDonationById(id)` | `id: number` | Retrieves a single donation record by ID. |
| `addDonation(itemData)` | `itemData: object` | Adds new listing to IndexedDB & LocalStorage, writes audit log. |
| `updateDonation(id, updates)` | `id: number, updates: object` | Updates fields on an existing donation with audit tracking. |
| `deleteDonation(id)` | `id: number` | Deletes a donation listing from both storage engines. |
| `applyFoodRequest(id, app)` | `id: number, app: object` | Saves receiver application and advances status to `Requested`. |
| `acceptRequest(id, notes)` | `id: number, notes: string` | Approves claim and advances status to `Request Accepted`. |
| `rejectRequest(id, reason)` | `id: number, reason: string` | Declines request, logs reason, and **resets listing back to `Available`**. |
| `dispatchForPickup(id, driver)` | `id: number, driver: string` | Assigns driver and sets status to `Out for Pickup`. |
| `markPickedUp(id)` | `id: number` | Confirms donor collection and advances status to `Picked Up`. |
| `dispatchForDelivery(id)` | `id: number` | Authorizes transit to shelter and sets status to `Out for Delivery`. |
| `markDelivered(id, proof)` | `id: number, proof: string` | Confirms shelter delivery with verification signature; sets status to `Delivered`. |
| `updateDonationStatus(id, st, actor)`| `id: number, st: string, actor: string` | Manual status override for administrative control. |
| `clearAllDonations()` | None | **Permanently deletes all food records from IndexedDB and LocalStorage**. |
| `resetToMockData()` | None | **Restores default SDG 2 Zero Hunger verified demo listings**. |
| `exportDatabaseJSON()` | None | Serializes entire database state and audit logs into a JSON string. |
| `downloadDatabaseBackup(jsonStr)` | `jsonStr: string` | Triggers a browser file download of `foodshare_backup_<timestamp>.json`. |
| `importDatabaseJSON(jsonContent)` | `jsonContent: string \| object` | Restores donations, users, and logs from an external JSON backup. |
| `getAuditLogs()` | None | Retrieves chronological audit trail records (newest first). |
| `clearAuditLogs()` | None | Wipes the audit log store and LocalStorage cache. |
| `getStorageDiagnostics()` | None | Returns active storage engine, record count, and approximate byte size. |
| `loginUser(email, key)` | `email, key` | Authenticates administrator credentials against IndexedDB `users`. |
| `logoutUser()` | None | Clears active administrator session from IndexedDB and LocalStorage. |
| `getCurrentUser()` | None | Retrieves currently active authenticated administrator session object. |
| `switchTestAccount(roleOrEmail)` | `roleOrEmail: string` | Switches active session to specified account in 1 click. |

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
  const hash = window.location.hash || '#/home';
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = clean.split('?');
  const segments = pathPart ? pathPart.split('/').filter(Boolean) : [];
  return { route: segments[0] || 'home', query: new URLSearchParams(queryPart || '') };
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
   Open your browser and navigate to `http://localhost:5173` (or the port reported by Vite).

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
        ├── Navbar.jsx           # Global responsive navigation with Donate CTA & Admin Login
        ├── HomePage.jsx         # 1st: Home Page with hero, live counters, and latest products
        ├── FoodListings.jsx     # 2nd: All Products directory with search & request modal
        ├── DonorForm.jsx        # 3rd: Public food donation form (no account needed)
        ├── AdminPanel.jsx       # 4th: Admin Control Panel (two-sided dossiers & logistics)
        ├── AdminLoginModal.jsx  # 5th: The Admin Login ONLY modal with 1-click test button
        ├── ProjectReport.jsx    # SDG 2 research documentation and architecture cards
        ├── Conclusion.jsx       # Feasibility, SDG alignment, and references
        ├── ReceiverDashboard.jsx# Multi-stage relief distribution pipeline tracker
        └── Toast.jsx            # Real-time animated notification alerts
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
