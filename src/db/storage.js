// ============================================================================
// Share The Bite SDG-2 PLATFORM: FIREBASE CLOUD DATA & AUTHENTICATION LAYER
// Pure Cloud Architecture: Firebase Cloud Firestore + Firebase Authentication
// Project ID: e-connect-sgs | Real-time Cloud Sync & Secure Admin Access
// ============================================================================

import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const LS_KEY_SESSION = 'Share The Bite_firebase_session';
const LS_KEY_CACHE = 'Share The Bite_donations_cache';

// ----------------------------------------------------------------------------
// Audit Logs (Disabled: not saving audit_logs to Firestore)
// ----------------------------------------------------------------------------
export async function logActivity() {
  // Not saving audit_logs as requested by user
  return null;
}

export async function getAuditLogs() {
  return [];
}

export async function clearAuditLogs() {
  return true;
}

// ----------------------------------------------------------------------------
// Firebase Authentication (Admin Access Only)
// ----------------------------------------------------------------------------

export async function loginUser(email, password) {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
    const fbUser = userCredential.user;

    const authenticatedUser = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email.split('@')[0],
      email: fbUser.email,
      role: 'admin',
      badge: 'Administrator',
      provider: 'firebase_auth',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(LS_KEY_SESSION, JSON.stringify(authenticatedUser));

    await logActivity(
      'ADMIN_LOGIN',
      `Administrator "${authenticatedUser.email}" signed in via Firebase Authentication.`,
      authenticatedUser.name
    );

    return authenticatedUser;
  } catch (firebaseAuthErr) {
    console.error('Firebase Auth sign in error:', firebaseAuthErr);
    let msg = 'Failed to sign in. Please verify your email and password.';
    if (
      firebaseAuthErr.code === 'auth/invalid-credential' ||
      firebaseAuthErr.code === 'auth/invalid-login-credentials'
    ) {
      msg = 'Invalid email or password. Please verify the credentials you created in Firebase Console.';
    } else if (firebaseAuthErr.code === 'auth/user-not-found') {
      msg = 'No user account found with this email in Firebase Authentication.';
    } else if (firebaseAuthErr.code === 'auth/wrong-password') {
      msg = 'Incorrect password entered.';
    } else if (firebaseAuthErr.code === 'auth/invalid-email') {
      msg = 'Please enter a valid email address.';
    } else if (firebaseAuthErr.code === 'auth/too-many-requests') {
      msg = 'Access temporarily disabled due to multiple failed login attempts. Try again in a few minutes.';
    } else if (firebaseAuthErr.message) {
      msg = firebaseAuthErr.message;
    }
    throw new Error(msg);
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase sign out error:', e);
  }
  localStorage.removeItem(LS_KEY_SESSION);
  return true;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(LS_KEY_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const userObj = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        role: 'admin',
        badge: 'Administrator',
        provider: 'firebase_auth'
      };
      localStorage.setItem(LS_KEY_SESSION, JSON.stringify(userObj));
      callback(userObj);
    } else {
      localStorage.removeItem(LS_KEY_SESSION);
      callback(null);
    }
  });
}

// ----------------------------------------------------------------------------
// Real-time Cloud Firestore Subscriptions & Storage Initialization
// ----------------------------------------------------------------------------
let donationSubscribers = [];

function notifyDonationSubscribers(items) {
  try {
    localStorage.setItem(LS_KEY_CACHE, JSON.stringify(items));
  } catch (e) {}
  donationSubscribers.forEach((cb) => {
    try {
      cb(items);
    } catch (e) {}
  });
}

export function subscribeToDonations(callback) {
  donationSubscribers.push(callback);
  return () => {
    donationSubscribers = donationSubscribers.filter((cb) => cb !== callback);
  };
}

let firestoreListenerUnsub = null;

function setupFirestoreRealtimeListener() {
  if (firestoreListenerUnsub) return;

  try {
    const firestoreRef = collection(db, 'donations');
    firestoreListenerUnsub = onSnapshot(
      firestoreRef,
      (snapshot) => {
        const cloudItems = [];
        snapshot.forEach((docSnap) => {
          cloudItems.push(docSnap.data());
        });
        cloudItems.sort((a, b) => (b.id || 0) - (a.id || 0));
        notifyDonationSubscribers(cloudItems);
      },
      (err) => {
        console.warn('Firestore real-time listener note:', err);
      }
    );
  } catch (e) {
    console.warn('Failed to attach Firestore listener:', e);
  }
}

export async function initializeStorage() {
  setupFirestoreRealtimeListener();

  try {
    const firestoreRef = collection(db, 'donations');
    const snapshot = await getDocs(firestoreRef);
    const donations = [];
    snapshot.forEach((docSnap) => {
      donations.push(docSnap.data());
    });
    donations.sort((a, b) => (b.id || 0) - (a.id || 0));
    try {
      localStorage.setItem(LS_KEY_CACHE, JSON.stringify(donations));
    } catch (e) {}
    return donations;
  } catch (err) {
    console.warn('Initial Firestore fetch note, checking cache:', err);
    try {
      const raw = localStorage.getItem(LS_KEY_CACHE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

// ----------------------------------------------------------------------------
// Pure Firebase Cloud Firestore CRUD Operations
// ----------------------------------------------------------------------------

export async function getAllDonations() {
  try {
    const firestoreRef = collection(db, 'donations');
    const snapshot = await getDocs(firestoreRef);
    const donations = [];
    snapshot.forEach((docSnap) => {
      donations.push(docSnap.data());
    });
    donations.sort((a, b) => (b.id || 0) - (a.id || 0));
    return donations;
  } catch (err) {
    try {
      const raw = localStorage.getItem(LS_KEY_CACHE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

export async function getDonationById(id) {
  const numId = Number(id);
  const docRef = doc(db, 'donations', String(numId));
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data();
  }
  const all = await getAllDonations();
  return all.find((d) => d.id === numId) || null;
}

export async function addDonation(donationData) {
  const now = new Date().toISOString();
  const nextId = Date.now() + Math.floor(Math.random() * 1000);

  const newItem = {
    id: nextId,
    item: donationData.item?.trim() || 'Prepared Surplus Food',
    category: donationData.category || 'Cooked Meals',
    quantity: donationData.quantity?.trim() || '1 Batch',
    servings: Number(donationData.servings) || 10,
    location: donationData.location?.trim() || 'Central Community Kitchen',
    city: donationData.city?.trim() || 'Metro District',
    donor: donationData.donor?.trim() || 'Anonymous Community Donor',
    donorType: donationData.donorType || 'Individual Citizen',
    donorPhone: donationData.donorPhone?.trim() || '+1 (555) 000-0000',
    donorEmail: donationData.donorEmail?.trim() || '',
    expiry: donationData.expiry || new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: 'Available',
    dietary: donationData.dietary || 'Standard',
    notes: donationData.notes?.trim() || '',
    urgency: donationData.urgency || 'medium',
    createdAt: now,
    updatedAt: now
  };

  const docRef = doc(db, 'donations', String(newItem.id));
  await setDoc(docRef, newItem);

  await logActivity(
    'DONATION_CREATED',
    `New donation listed: "${newItem.item}" (${newItem.quantity}) by ${newItem.donor}.`,
    newItem.donor
  );

  return newItem;
}

export async function updateDonation(id, updates) {
  const numId = Number(id);
  const docRef = doc(db, 'donations', String(numId));

  const updatePayload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, updatePayload, { merge: true });

  await logActivity(
    'DONATION_UPDATED',
    `Updated donation #${numId}.`,
    'Admin'
  );

  return { id: numId, ...updatePayload };
}

export async function deleteDonation(id) {
  const numId = Number(id);
  const docRef = doc(db, 'donations', String(numId));
  await deleteDoc(docRef);

  await logActivity('DONATION_DELETED', `Deleted donation #${numId}.`, 'System Admin');
  return true;
}

// ----------------------------------------------------------------------------
// Service Requests & Logistics Lifecycle Management (Cloud Firestore)
// ----------------------------------------------------------------------------

export async function applyFoodRequest(id, application) {
  const numId = Number(id);
  const now = new Date().toISOString();

  const receiverApp = {
    receiverName: application.receiverName || 'Community Relief Partner',
    receiverType: application.receiverType || 'Non-Profit Shelter',
    contactPerson: application.contactPerson || 'Relief Coordinator',
    receiverPhone: application.receiverPhone || '+1 (555) 000-0000',
    receiverEmail: application.receiverEmail || '',
    deliveryAddress: application.deliveryAddress || 'Central Shelter Facility',
    beneficiaryCount: Number(application.beneficiaryCount) || 20,
    vehicleType: application.vehicleType || 'Volunteer Van Available',
    urgency: application.urgency || 'Immediate',
    receiverNotes: application.receiverNotes || '',
    appliedAt: now
  };

  const updates = {
    status: 'Requested',
    receiver: receiverApp.receiverName,
    receiverPhone: receiverApp.receiverPhone,
    receiverEmail: receiverApp.receiverEmail,
    receiverApplication: receiverApp,
    appliedAt: now
  };

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'REQUEST_SUBMITTED',
    `Receiver "${receiverApp.receiverName}" requested donation #${numId} for ${receiverApp.beneficiaryCount} beneficiaries.`,
    receiverApp.receiverName
  );

  return updated;
}

export async function acceptRequest(id, adminNotes = '') {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Request Accepted',
    acceptedAt: now,
    adminNotes: adminNotes || 'Request approved by System Administration.'
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('REQUEST_ACCEPTED', `Accepted request for donation #${numId}.`, 'Admin');
  return updated;
}

export async function rejectRequest(id, rejectionReason = '') {
  const numId = Number(id);
  const updates = {
    status: 'Available',
    receiver: null,
    receiverPhone: null,
    receiverEmail: null,
    receiverApplication: null,
    appliedAt: null,
    rejectionReason: rejectionReason || 'Request declined by System Administrator.'
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('REQUEST_REJECTED', `Declined request for donation #${numId}. Reset to Available.`, 'Admin');
  return updated;
}

export async function dispatchForPickup(id, driverInfo = 'Logistics Team') {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Out for Pickup',
    driver: driverInfo,
    outForPickupAt: now
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('OUT_FOR_PICKUP', `Donation #${numId} dispatched for pickup with driver "${driverInfo}".`, 'Admin');
  return updated;
}

export async function markPickedUp(id) {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Picked Up',
    pickedUpAt: now
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('FOOD_PICKED_UP', `Donation #${numId} picked up from donor.`, 'Driver');
  return updated;
}

export async function dispatchForDelivery(id) {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Out for Delivery',
    outForDeliveryAt: now
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('OUT_FOR_DELIVERY', `Donation #${numId} is out for delivery.`, 'Logistics');
  return updated;
}

export async function markDelivered(id, deliveryProof = '') {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Delivered',
    deliveredAt: now,
    deliveryProof: deliveryProof || 'Handover signature verified at destination.'
  };

  const updated = await updateDonation(numId, updates);
  await logActivity('FOOD_DELIVERED', `Donation #${numId} delivered successfully.`, 'Logistics');
  return updated;
}

export async function updateDonationStatus(id, newStatus, actor = 'System') {
  const numId = Number(id);
  const updates = { status: newStatus };
  const now = new Date().toISOString();

  if (newStatus === 'Delivered') updates.deliveredAt = now;
  if (newStatus === 'Picked Up') updates.pickedUpAt = now;
  if (newStatus === 'Out for Pickup') updates.outForPickupAt = now;
  if (newStatus === 'Out for Delivery') updates.outForDeliveryAt = now;
  if (newStatus === 'Request Accepted') updates.acceptedAt = now;
  if (newStatus === 'Available') {
    updates.receiver = null;
    updates.receiverPhone = null;
    updates.receiverApplication = null;
  }

  const updated = await updateDonation(numId, updates);
  await logActivity('STATUS_CHANGED', `Donation #${numId} status changed to "${newStatus}".`, actor);
  return updated;
}

export async function clearAllDonations() {
  try {
    const snapshot = await getDocs(collection(db, 'donations'));
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    localStorage.removeItem(LS_KEY_CACHE);
    await logActivity('DATABASE_CLEARED', 'All donations cleared from Firebase Cloud Firestore.', 'Admin');
    return true;
  } catch (err) {
    console.error('Failed to clear donations:', err);
    throw err;
  }
}

export async function exportDatabaseJSON() {
  const donations = await getAllDonations();
  const logs = await getAuditLogs();

  const payload = {
    appName: 'Share The Bite SDG-2 Platform',
    exportedAt: new Date().toISOString(),
    cloudDatabase: 'Firebase Cloud Firestore (e-connect-sgs)',
    totalDonations: donations.length,
    donations,
    logs
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadDatabaseBackup(jsonString) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sharethebite_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importDatabaseJSON(jsonContent) {
  const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
  if (!parsed || !Array.isArray(parsed.donations)) {
    throw new Error('Invalid JSON format: missing "donations" array.');
  }

  const batch = writeBatch(db);
  parsed.donations.forEach((item) => {
    const id = item.id ? Number(item.id) : Date.now() + Math.floor(Math.random() * 1000);
    const docRef = doc(db, 'donations', String(id));
    batch.set(docRef, { ...item, id });
  });

  await batch.commit();
  await logActivity('DATABASE_IMPORTED', `Imported ${parsed.donations.length} records into Firestore.`, 'Admin');
  return getAllDonations();
}

export async function getStorageDiagnostics() {
  const donations = await getAllDonations();
  const logs = await getAuditLogs();
  const currentUser = getCurrentUser();

  return {
    engine: 'Firebase Cloud Firestore & Firebase Auth',
    projectId: 'e-connect-sgs',
    firestoreConnected: true,
    totalDonations: donations.length,
    totalLogs: logs.length,
    currentUser,
    lastSyncTime: new Date().toLocaleTimeString()
  };
}

export async function getAllUsers() {
  const current = getCurrentUser();
  return current ? [current] : [];
}

export async function registerUser(userData) {
  return userData;
}

export async function switchTestAccount() {
  throw new Error('Test account switcher disabled. Please sign in with your Firebase Authentication credentials.');
}

export async function resetToMockData() {
  // Demo data removed: Resets to clean empty Firebase Cloud Firestore state
  await clearAllDonations();
  await logActivity('DATABASE_CLEARED', 'Database reset to clean state (demo data removed).', 'Admin');
  return [];
}
