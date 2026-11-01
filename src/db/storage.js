// ============================================================================
// FOODSHARE SDG-2 PLATFORM: PERSISTENT STORAGE & AUTHENTICATION LAYER
// Dual-Engine: IndexedDB (Primary) + LocalStorage (Real-time Mirror / Fallback)
// Includes Transactional Users & Session Stores for Role-Based Test Access
// ============================================================================

const DB_NAME = 'FoodShareAppDB';
const DB_VERSION = 2;
const STORE_DONATIONS = 'donations';
const STORE_LOGS = 'audit_logs';
const STORE_SETTINGS = 'app_settings';
const STORE_USERS = 'users';
const STORE_SESSIONS = 'sessions';

const LS_KEY_DONATIONS = 'foodshare_donations_backup';
const LS_KEY_LOGS = 'foodshare_logs_backup';
const LS_KEY_SETTINGS = 'foodshare_settings_backup';
const LS_KEY_USERS = 'foodshare_users_backup';
const LS_KEY_SESSION = 'foodshare_active_session';

// Pre-configured Test Accounts stored in IndexedDB (for demo & testing)
export const initialTestUsers = [
  {
    id: 'usr_admin_01',
    name: 'Sarah Jenkins',
    email: 'admin@foodshare.org',
    key: 'admin123',
    role: 'admin',
    organization: 'FoodShare Platform Oversight',
    phone: '+1 (555) 100-2000',
    title: 'Platform Administrator',
    avatarInitials: 'SJ',
    badge: 'Administrator',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_donor_02',
    name: 'Chef Marco Rossi',
    email: 'donor@fresheats.org',
    key: 'donor123',
    role: 'donor',
    organization: 'Fresh Eats Catering Co.',
    phone: '+1 (555) 234-5678',
    title: 'Executive Catering Chef',
    avatarInitials: 'MR',
    badge: 'Verified Donor',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_shelter_03',
    name: 'Elena Vance',
    email: 'shelter@hope.org',
    key: 'shelter123',
    role: 'receiver',
    organization: 'Hope Foundation Shelter',
    phone: '+1 (555) 888-1212',
    title: 'Relief Operations Director',
    avatarInitials: 'EV',
    badge: 'Registered NGO',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_volunteer_04',
    name: 'David Kim',
    email: 'volunteer@green.org',
    key: 'volunteer123',
    role: 'volunteer',
    organization: 'Green Dispatch Volunteers',
    phone: '+1 (555) 444-9988',
    title: 'Logistics Courier Volunteer',
    avatarInitials: 'DK',
    badge: 'Volunteer Driver',
    createdAt: new Date().toISOString()
  }
];

// Initial Mock Seed Data (Aligned with SDG 2: Zero Hunger)
export const initialMockDonations = [
  {
    id: 101,
    item: "Assorted Gourmet Sandwiches and Veggie Wraps",
    category: "Cooked Meals",
    quantity: "50 servings",
    servings: 50,
    location: "Downtown Corporate Center, Block B, 4th Floor",
    city: "Metro Central",
    donor: "Fresh Eats Catering Co.",
    donorPhone: "+1 (555) 234-5678",
    donorEmail: "catering@fresheats.org",
    expiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegetarian and Halal Options",
    notes: "Packed in sanitized insulated catering containers. Ready for pickup.",
    urgency: "medium",
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
  },
  {
    id: 102,
    item: "Fresh Farm Produce Crate (Crisp Apples and Carrots)",
    category: "Fresh Produce",
    quantity: "25 kgs",
    servings: 60,
    location: "Sector 17 Green Wholesale Market, Stall 42",
    city: "West District",
    donor: "Green Grocers Association",
    donorPhone: "+1 (555) 345-6789",
    donorEmail: "contact@greengrocers.org",
    expiry: new Date(Date.now() + 72 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "100% Organic Vegan",
    notes: "Freshly harvested produce with minor cosmetic variations, completely fresh.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  },
  {
    id: 103,
    item: "Leftover Banquet Steamed Rice, Dal and Veg Curry",
    category: "Cooked Meals",
    quantity: "45 servings",
    servings: 45,
    location: "Grand Plaza Hotel, Service Gate 3, Banquet Kitchen",
    city: "Metro Central",
    donor: "Grand Plaza Hotel & Suites",
    donorPhone: "+1 (555) 456-7890",
    donorEmail: "chef@grandplazahotel.com",
    expiry: new Date(Date.now() + 10 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Pending Pickup",
    receiver: "Hope Foundation Shelter",
    receiverPhone: "+1 (555) 888-1212",
    receiverNotes: "Volunteer van dispatched. ETA 45 minutes.",
    dietary: "Vegetarian",
    notes: "Maintained in temperature-controlled chafing dishes after lunch event.",
    urgency: "high",
    claimedAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  },
  {
    id: 104,
    item: "Artisan Sourdough Loaves and Croissant Assortment",
    category: "Bakery",
    quantity: "22 loaves and 35 pastries",
    servings: 55,
    location: "Sunrise Artisan Bakery, 104 High Street",
    city: "North Ward",
    donor: "Sunrise Artisan Bakery",
    donorPhone: "+1 (555) 567-8901",
    donorEmail: "orders@sunrisebakery.com",
    expiry: new Date(Date.now() + 36 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Delivered",
    receiver: "Community Youth Kitchen",
    receiverPhone: "+1 (555) 999-4321",
    receiverNotes: "Received in great condition and distributed to 40 families.",
    dietary: "Vegetarian",
    notes: "Baked fresh today morning, bagged individually.",
    urgency: "low",
    claimedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString()
  },
  {
    id: 105,
    item: "Pasteurized Milk Cartons and Natural Greek Yogurt",
    category: "Dairy",
    quantity: "20 cartons (1L each) and 30 tubs",
    servings: 50,
    location: "Valley Cold Storage Hub, Bay 12",
    city: "South District",
    donor: "Valley Farm Dairy Co.",
    donorPhone: "+1 (555) 678-9012",
    donorEmail: "dispatch@valleydairy.com",
    expiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegetarian / Gluten-Free",
    notes: "Refrigerated transport required. Temperature strictly 2-4°C.",
    urgency: "medium",
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 106,
    item: "Surplus Canned Black Beans, Corn and Tomato Puree",
    category: "Packaged & Canned",
    quantity: "40 large cans",
    servings: 80,
    location: "Metro Wholesale Supermarket, Loading Dock 2",
    city: "East Harbor",
    donor: "Metro Retail Distribution",
    donorPhone: "+1 (555) 789-0123",
    donorEmail: "community@metromarket.com",
    expiry: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegan / Non-Perishable",
    notes: "Surplus inventory from seasonal change. Cans unopened and sealed.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  }
];

// ----------------------------------------------------------------------------
// IndexedDB Engine Helpers
// ----------------------------------------------------------------------------
let dbInstance = null;

function isIndexedDBSupported() {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

export function openDB() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error('IndexedDB is not supported in this browser environment.'));
    }

    if (dbInstance) {
      return resolve(dbInstance);
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_DONATIONS)) {
        const donationStore = db.createObjectStore(STORE_DONATIONS, { keyPath: 'id' });
        donationStore.createIndex('status', 'status', { unique: false });
        donationStore.createIndex('category', 'category', { unique: false });
        donationStore.createIndex('donor', 'donor', { unique: false });
        donationStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        const logStore = db.createObjectStore(STORE_LOGS, { keyPath: 'id' });
        logStore.createIndex('timestamp', 'timestamp', { unique: false });
        logStore.createIndex('action', 'action', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
        db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }

      // User Authentication Store
      if (!db.objectStoreNames.contains(STORE_USERS)) {
        const userStore = db.createObjectStore(STORE_USERS, { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
        userStore.createIndex('role', 'role', { unique: false });
      }

      // Active Sessions Store
      if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
        db.createObjectStore(STORE_SESSIONS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

// ----------------------------------------------------------------------------
// LocalStorage Fallback & Mirror Utilities
// ----------------------------------------------------------------------------
function readLocalStorage(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`LocalStorage read error for ${key}:`, e);
    return fallback;
  }
}

function writeLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`LocalStorage write error for ${key}:`, e);
  }
}

// ----------------------------------------------------------------------------
// Audit Log Manager
// ----------------------------------------------------------------------------
export async function logActivity(action, details, actor = 'System') {
  const logEntry = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    action,
    details,
    actor
  };

  // 1. Mirror to LocalStorage
  const existingLogs = readLocalStorage(LS_KEY_LOGS, []);
  const updatedLogs = [logEntry, ...existingLogs].slice(0, 200);
  writeLocalStorage(LS_KEY_LOGS, updatedLogs);

  // 2. Persist to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_LOGS, 'readwrite');
    const store = tx.objectStore(STORE_LOGS);
    store.put(logEntry);
  } catch (err) {
    // Graceful fallback in LocalStorage
  }

  return logEntry;
}

export async function getAuditLogs() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_LOGS, 'readonly');
      const store = tx.objectStore(STORE_LOGS);
      const req = store.getAll();
      req.onsuccess = () => {
        const logs = req.result || [];
        if (logs.length > 0) {
          logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          resolve(logs);
        } else {
          resolve(readLocalStorage(LS_KEY_LOGS, []));
        }
      };
      req.onerror = () => {
        resolve(readLocalStorage(LS_KEY_LOGS, []));
      };
    });
  } catch (e) {
    return readLocalStorage(LS_KEY_LOGS, []);
  }
}

export async function clearAuditLogs() {
  writeLocalStorage(LS_KEY_LOGS, []);
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_LOGS, 'readwrite');
    tx.objectStore(STORE_LOGS).clear();
  } catch (e) {
    // Ignore if offline
  }
}

// ----------------------------------------------------------------------------
// USER AUTHENTICATION & SESSION MANAGEMENT (IndexedDB + LocalStorage)
// ----------------------------------------------------------------------------

export async function initializeUsers() {
  let users = [];
  try {
    const db = await openDB();
    users = await new Promise((resolve) => {
      const tx = db.transaction(STORE_USERS, 'readonly');
      const store = tx.objectStore(STORE_USERS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (users.length === 0) {
      // Check LocalStorage
      const lsUsers = readLocalStorage(LS_KEY_USERS, null);
      if (lsUsers && Array.isArray(lsUsers) && lsUsers.length > 0) {
        users = lsUsers;
      } else {
        users = [...initialTestUsers];
      }

      // Seed into IndexedDB
      const writeTx = db.transaction(STORE_USERS, 'readwrite');
      const writeStore = writeTx.objectStore(STORE_USERS);
      users.forEach(u => writeStore.put(u));
      writeLocalStorage(LS_KEY_USERS, users);
    } else {
      writeLocalStorage(LS_KEY_USERS, users);
    }
  } catch (err) {
    let lsUsers = readLocalStorage(LS_KEY_USERS, null);
    if (!lsUsers || lsUsers.length === 0) {
      lsUsers = [...initialTestUsers];
      writeLocalStorage(LS_KEY_USERS, lsUsers);
    }
    users = lsUsers;
  }

  // Ensure an active session exists (defaults to Admin for seamless demo)
  let activeSession = readLocalStorage(LS_KEY_SESSION, null);
  if (!activeSession) {
    activeSession = {
      id: 'session_active',
      user: users[0] || initialTestUsers[0],
      token: 'token_' + Date.now(),
      loginTime: new Date().toISOString()
    };
    writeLocalStorage(LS_KEY_SESSION, activeSession);
  }

  return { users, activeUser: activeSession.user };
}

export async function getAllUsers() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_USERS, 'readonly');
      const store = tx.objectStore(STORE_USERS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || readLocalStorage(LS_KEY_USERS, initialTestUsers));
      req.onerror = () => resolve(readLocalStorage(LS_KEY_USERS, initialTestUsers));
    });
  } catch (e) {
    return readLocalStorage(LS_KEY_USERS, initialTestUsers);
  }
}

export async function loginUser(email, key) {
  const users = await getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    throw new Error('No registered account found with this email address.');
  }

  if (found.key !== key.trim()) {
    throw new Error('Invalid access key or password for this account.');
  }

  // Create session
  const session = {
    id: 'session_active',
    user: found,
    token: 'token_' + Date.now(),
    loginTime: new Date().toISOString()
  };

  writeLocalStorage(LS_KEY_SESSION, session);

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SESSIONS, 'readwrite');
    tx.objectStore(STORE_SESSIONS).put(session);
  } catch (e) {
    // LocalStorage already saved
  }

  await logActivity(
    'USER_LOGIN',
    `Authenticated user "${found.name}" with role "${found.role}".`,
    found.name
  );

  return session.user;
}

export async function registerUser(userData) {
  const users = await getAllUsers();
  const cleanEmail = userData.email.trim().toLowerCase();
  
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists in IndexedDB.');
  }

  const initials = userData.name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'US';

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    name: userData.name.trim(),
    email: cleanEmail,
    key: userData.key.trim(),
    role: userData.role || 'donor',
    organization: userData.organization?.trim() || 'Community Partner',
    phone: userData.phone?.trim() || '+1 (555) 000-0000',
    title: userData.title?.trim() || 'Member',
    avatarInitials: initials,
    badge: userData.role === 'admin' ? 'Administrator' : userData.role === 'donor' ? 'Food Donor' : 'Relief Partner',
    createdAt: new Date().toISOString()
  };

  // 1. LocalStorage
  const updatedUsers = [...users, newUser];
  writeLocalStorage(LS_KEY_USERS, updatedUsers);

  // 2. IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_USERS, 'readwrite');
    tx.objectStore(STORE_USERS).put(newUser);
  } catch (e) {
    console.warn('User register IndexedDB fallback:', e);
  }

  // Automatically switch session to newly registered user
  const session = {
    id: 'session_active',
    user: newUser,
    token: 'token_' + Date.now(),
    loginTime: new Date().toISOString()
  };
  writeLocalStorage(LS_KEY_SESSION, session);

  await logActivity(
    'USER_REGISTERED',
    `Created new ${newUser.role} account for "${newUser.name}" (${newUser.organization}).`,
    newUser.name
  );

  return newUser;
}

export async function logoutUser() {
  const activeSession = readLocalStorage(LS_KEY_SESSION, null);
  const userName = activeSession?.user?.name || 'User';

  writeLocalStorage(LS_KEY_SESSION, null);

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SESSIONS, 'readwrite');
    tx.objectStore(STORE_SESSIONS).clear();
  } catch (e) {
    // Ignore
  }

  await logActivity('USER_LOGOUT', `User "${userName}" logged out.`, userName);
  return true;
}

export function getCurrentUser() {
  const active = readLocalStorage(LS_KEY_SESSION, null);
  return active ? active.user : null;
}

export async function switchTestAccount(roleOrEmail) {
  const users = await getAllUsers();
  let match = users.find(u => u.email.toLowerCase() === roleOrEmail.toLowerCase());
  if (!match) {
    match = users.find(u => u.role === roleOrEmail);
  }
  if (!match) {
    match = users[0];
  }

  const session = {
    id: 'session_active',
    user: match,
    token: 'token_' + Date.now(),
    loginTime: new Date().toISOString()
  };

  writeLocalStorage(LS_KEY_SESSION, session);

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_SESSIONS, 'readwrite');
    tx.objectStore(STORE_SESSIONS).put(session);
  } catch (e) {
    // Ignored
  }

  await logActivity(
    'TEST_ACCOUNT_SWITCHED',
    `Switched test session to "${match.name}" (${match.role}).`,
    match.name
  );

  return match;
}

// ----------------------------------------------------------------------------
// Core Storage Initialization & Sync
// ----------------------------------------------------------------------------
export async function initializeStorage() {
  let donations = [];

  // Check if we can open IndexedDB
  try {
    const db = await openDB();
    donations = await new Promise((resolve) => {
      const tx = db.transaction(STORE_DONATIONS, 'readonly');
      const store = tx.objectStore(STORE_DONATIONS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    if (donations.length === 0) {
      // Check if LocalStorage has backup
      const lsBackup = readLocalStorage(LS_KEY_DONATIONS, null);
      if (lsBackup && Array.isArray(lsBackup) && lsBackup.length > 0) {
        donations = lsBackup;
        const writeTx = db.transaction(STORE_DONATIONS, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_DONATIONS);
        donations.forEach(item => writeStore.put(item));
        await logActivity('INDEXEDDB_RESTORED', `Restored ${donations.length} items from LocalStorage backup into IndexedDB.`);
      } else {
        // Both are empty: Seed with initial Mock SDG 2 Data
        donations = [...initialMockDonations];
        const seedTx = db.transaction(STORE_DONATIONS, 'readwrite');
        const seedStore = seedTx.objectStore(STORE_DONATIONS);
        donations.forEach(item => seedStore.put(item));
        writeLocalStorage(LS_KEY_DONATIONS, donations);
        await logActivity('INITIAL_SEED', `Seeded database with ${donations.length} SDG 2 FoodShare listings.`);
      }
    } else {
      writeLocalStorage(LS_KEY_DONATIONS, donations);
    }
  } catch (err) {
    console.warn('IndexedDB unavailable or blocked. Using LocalStorage primary mode:', err);
    let lsBackup = readLocalStorage(LS_KEY_DONATIONS, null);
    if (!lsBackup || lsBackup.length === 0) {
      lsBackup = [...initialMockDonations];
      writeLocalStorage(LS_KEY_DONATIONS, lsBackup);
    }
    donations = lsBackup;
  }

  // Also initialize users and auth session
  await initializeUsers();

  return donations;
}

// ----------------------------------------------------------------------------
// CRUD Methods for Food Donations
// ----------------------------------------------------------------------------

export async function getAllDonations() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_DONATIONS, 'readonly');
      const store = tx.objectStore(STORE_DONATIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        writeLocalStorage(LS_KEY_DONATIONS, items);
        resolve(items);
      };
      req.onerror = () => {
        resolve(readLocalStorage(LS_KEY_DONATIONS, []));
      };
    });
  } catch (e) {
    return readLocalStorage(LS_KEY_DONATIONS, []);
  }
}

export async function getDonationById(id) {
  const numId = Number(id);
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_DONATIONS, 'readonly');
      const store = tx.objectStore(STORE_DONATIONS);
      const req = store.get(numId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => {
        const ls = readLocalStorage(LS_KEY_DONATIONS, []);
        resolve(ls.find(d => d.id === numId) || null);
      };
    });
  } catch (e) {
    const ls = readLocalStorage(LS_KEY_DONATIONS, []);
    return ls.find(d => d.id === numId) || null;
  }
}

export async function addDonation(itemData) {
  const newItem = {
    id: itemData.id ? Number(itemData.id) : Date.now(),
    item: itemData.item || "Surplus Food Donation",
    category: itemData.category || "Cooked Meals",
    quantity: itemData.quantity || "10 servings",
foodshare-reactD754-35D4    servings: itemData.servings ? Number(itemData.servings) : 10,
    location: itemData.location || "Community Center",
    city: itemData.city || "Local City",
    donor: itemData.donor || "Anonymous Donor",
    donorPhone: itemData.donorPhone || "",
    donorEmail: itemData.donorEmail || "",
    expiry: itemData.expiry || new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: itemData.status || "Available",
    dietary: itemData.dietary || "Standard",
    notes: itemData.notes || "",
    urgency: itemData.urgency || "medium",
    receiver: itemData.receiver || null,
    receiverPhone: itemData.receiverPhone || null,
    receiverNotes: itemData.receiverNotes || null,
    createdAt: new Date().toISOString()
  };

  // 1. Update LocalStorage
  const ls = readLocalStorage(LS_KEY_DONATIONS, []);
  const updated = [newItem, ...ls];
  writeLocalStorage(LS_KEY_DONATIONS, updated);

  // 2. Update IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DONATIONS, 'readwrite');
    tx.objectStore(STORE_DONATIONS).put(newItem);
  } catch (err) {
    console.warn('Error saving to IndexedDB:', err);
  }

  await logActivity(
    'DONATION_CREATED',
    `New donation listed: "${newItem.item}" (${newItem.quantity}) by ${newItem.donor}.`,
    newItem.donor
  );

  return newItem;
}

export async function updateDonation(id, updates) {
  const numId = Number(id);
  let updatedItem = null;

  // 1. Update LocalStorage
  const ls = readLocalStorage(LS_KEY_DONATIONS, []);
  const index = ls.findIndex(d => d.id === numId);
  if (index !== -1) {
    updatedItem = { ...ls[index], ...updates, updatedAt: new Date().toISOString() };
    ls[index] = updatedItem;
    writeLocalStorage(LS_KEY_DONATIONS, ls);
  }

  // 2. Update IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DONATIONS, 'readwrite');
    const store = tx.objectStore(STORE_DONATIONS);
    const existing = await new Promise((resolve) => {
      const getReq = store.get(numId);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => resolve(null);
    });

    if (existing) {
      updatedItem = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      store.put(updatedItem);
    }
  } catch (err) {
    console.warn('Error updating in IndexedDB:', err);
  }

  await logActivity(
    'DONATION_UPDATED',
    `Updated donation #${numId} (${updatedItem?.item || 'Item'}).`,
    'System'
  );

  return updatedItem;
}

export async function deleteDonation(id) {
  const numId = Number(id);
  let deletedItem = null;

  // 1. Remove from LocalStorage
  const ls = readLocalStorage(LS_KEY_DONATIONS, []);
  deletedItem = ls.find(d => d.id === numId);
  const filtered = ls.filter(d => d.id !== numId);
  writeLocalStorage(LS_KEY_DONATIONS, filtered);

  // 2. Remove from IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DONATIONS, 'readwrite');
    tx.objectStore(STORE_DONATIONS).delete(numId);
  } catch (err) {
    console.warn('Error deleting from IndexedDB:', err);
  }

  await logActivity(
    'DONATION_DELETED',
    `Deleted donation listing #${numId} (${deletedItem?.item || 'Item'}).`,
    'Admin'
  );

  return true;
}

export async function claimDonation(id, receiverInfo) {
  const numId = Number(id);
  const updates = {
    status: 'Pending Pickup',
    receiver: receiverInfo.receiverName || 'Registered NGO Partner',
    receiverPhone: receiverInfo.receiverPhone || '+1 (555) 000-0000',
    receiverNotes: receiverInfo.receiverNotes || 'Claimed via FoodShare app for immediate redistribution.',
    claimedAt: new Date().toISOString()
  };

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'DONATION_CLAIMED',
    `Donation #${numId} claimed by "${updates.receiver}" for pickup.`,
    updates.receiver
  );

  return updated;
}

export async function updateDonationStatus(id, newStatus, actor = 'NGO Receiver') {
  const numId = Number(id);
  const updates = { status: newStatus };
  if (newStatus === 'Delivered') {
    updates.deliveredAt = new Date().toISOString();
  } else if (newStatus === 'Picked Up') {
    updates.pickedUpAt = new Date().toISOString();
  }

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'STATUS_CHANGED',
    `Donation #${numId} status changed to "${newStatus}".`,
    actor
  );

  return updated;
}

// ----------------------------------------------------------------------------
// Admin: Clear All, Reset, Export, Import
// ----------------------------------------------------------------------------

export async function clearAllDonations() {
  // Clear LocalStorage
  writeLocalStorage(LS_KEY_DONATIONS, []);

  // Clear IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DONATIONS, 'readwrite');
    tx.objectStore(STORE_DONATIONS).clear();
  } catch (err) {
    console.warn('Error clearing IndexedDB:', err);
  }

  await logActivity(
    'ALL_DONATIONS_CLEARED',
    'Cleared all food donation records from IndexedDB and LocalStorage.',
    'System Admin'
  );

  return [];
}

export async function resetToMockData() {
  // Overwrite LocalStorage
  writeLocalStorage(LS_KEY_DONATIONS, initialMockDonations);

  // Overwrite IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_DONATIONS, 'readwrite');
    const store = tx.objectStore(STORE_DONATIONS);
    store.clear();
    initialMockDonations.forEach(item => store.put(item));
  } catch (err) {
    console.warn('Error resetting IndexedDB to mock data:', err);
  }

  await logActivity(
    'DATABASE_RESET',
    `Reset database with ${initialMockDonations.length} default SDG-2 demo records in IndexedDB & LocalStorage.`,
    'System Admin'
  );

  return [...initialMockDonations];
}

export async function exportDatabaseJSON() {
  const donations = await getAllDonations();
  const logs = await getAuditLogs();
  const users = await getAllUsers();
  
  const payload = {
    appName: "FoodShare UN SDG-2 Platform",
    exportVersion: 2,
    exportedAt: new Date().toISOString(),
    stats: {
      totalDonations: donations.length,
      availableCount: donations.filter(d => d.status === 'Available').length,
      claimedCount: donations.filter(d => d.status === 'Pending Pickup').length,
      deliveredCount: donations.filter(d => d.status === 'Delivered').length,
      totalUsers: users.length,
      totalLogs: logs.length
    },
    donations,
    users,
    logs
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadDatabaseBackup(jsonString) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `foodshare_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importDatabaseJSON(jsonContent) {
  try {
    const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
    if (!parsed || !Array.isArray(parsed.donations)) {
      throw new Error('Invalid JSON format: missing "donations" array.');
    }

    const validDonations = parsed.donations.map(item => ({
      ...item,
      id: item.id ? Number(item.id) : Date.now() + Math.floor(Math.random() * 1000)
    }));

    // Save to LocalStorage
    writeLocalStorage(LS_KEY_DONATIONS, validDonations);

    if (parsed.logs && Array.isArray(parsed.logs)) {
      writeLocalStorage(LS_KEY_LOGS, parsed.logs);
    }

    if (parsed.users && Array.isArray(parsed.users)) {
      writeLocalStorage(LS_KEY_USERS, parsed.users);
    }

    // Save to IndexedDB
    try {
      const db = await openDB();
      const tx = db.transaction([STORE_DONATIONS, STORE_LOGS, STORE_USERS], 'readwrite');
      
      const donStore = tx.objectStore(STORE_DONATIONS);
      donStore.clear();
      validDonations.forEach(item => donStore.put(item));

      if (parsed.logs && Array.isArray(parsed.logs)) {
        const logStore = tx.objectStore(STORE_LOGS);
        logStore.clear();
        parsed.logs.forEach(log => logStore.put(log));
      }

      if (parsed.users && Array.isArray(parsed.users)) {
        const userStore = tx.objectStore(STORE_USERS);
        userStore.clear();
        parsed.users.forEach(u => userStore.put(u));
      }
    } catch (err) {
      console.warn('IndexedDB write during import failed, fallback in LocalStorage:', err);
    }

    await logActivity(
      'DATABASE_IMPORTED',
      `Imported database backup containing ${validDonations.length} donations and ${parsed.logs?.length || 0} audit logs.`,
      'System Admin'
    );

    return validDonations;
  } catch (err) {
    throw new Error('Failed to import database: ' + err.message);
  }
}

export async function getStorageDiagnostics() {
  const donations = await getAllDonations();
  const logs = await getAuditLogs();
  const users = await getAllUsers();
  const activeSession = readLocalStorage(LS_KEY_SESSION, null);

  const rawDonations = JSON.stringify(donations);
  const rawLogs = JSON.stringify(logs);
  const rawUsers = JSON.stringify(users);
  const bytesEstimate = (rawDonations.length + rawLogs.length + rawUsers.length) * 2;

  return {
    engine: isIndexedDBSupported() ? 'IndexedDB (Primary) + LocalStorage (Mirror)' : 'LocalStorage Mode (Fallback)',
    indexedDBAvailable: isIndexedDBSupported(),
    localStorageAvailable: typeof window !== 'undefined' && 'localStorage' in window,
    databaseName: DB_NAME,
    totalDonations: donations.length,
    totalUsers: users.length,
    totalLogs: logs.length,
    currentUser: activeSession?.user || null,
    approximateSizeBytes: bytesEstimate,
    approximateSizeFormatted: (bytesEstimate / 1024).toFixed(2) + ' KB',
    lastSyncTime: new Date().toLocaleTimeString()
  };
}
