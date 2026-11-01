// ============================================================================
// Share The Bite SDG-2 PLATFORM: PERSISTENT STORAGE & AUTHENTICATION LAYER
// Dual-Engine: IndexedDB (Primary) + LocalStorage (Real-time Mirror / Fallback)
// Includes Transactional Users & Session Stores for Role-Based Test Access
// ============================================================================

const DB_NAME = 'Share The BiteAppDB';
const DB_VERSION = 2;
const STORE_DONATIONS = 'donations';
const STORE_LOGS = 'audit_logs';
const STORE_SETTINGS = 'app_settings';
const STORE_USERS = 'users';
const STORE_SESSIONS = 'sessions';

const LS_KEY_DONATIONS = 'Share The Bite_donations_backup';
const LS_KEY_LOGS = 'Share The Bite_logs_backup';
const LS_KEY_SETTINGS = 'Share The Bite_settings_backup';
const LS_KEY_USERS = 'Share The Bite_users_backup';
const LS_KEY_SESSION = 'Share The Bite_active_session';

// Pre-configured Test Accounts stored in IndexedDB (for demo & testing)
export const initialTestUsers = [
  {
    id: 'usr_admin_01',
    name: 'Sarah Jenkins',
    email: 'admin@foodshare.org',
    key: 'admin123',
    role: 'admin',
    organization: 'Share The Bite Platform Oversight',
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

// Initial Mock Seed Data: 20 Comprehensive Sample Products (Aligned with SDG 2: Zero Hunger)
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
    donorType: "Catering Service",
    donorPhone: "+1 (555) 234-5678",
    donorEmail: "catering@fresheats.org",
    expiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegetarian and Halal Options",
    notes: "Packed in sanitized insulated catering containers. Chilled at 4°C.",
    urgency: "medium",
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
  },
  {
    id: 102,
    item: "Crisp Organic Apples, Pears and Garden Carrots",
    category: "Fresh Produce",
    quantity: "30 kgs (3 crates)",
    servings: 65,
    location: "Sector 17 Green Wholesale Market, Stall 42",
    city: "West District",
    donor: "Green Grocers Association",
    donorType: "Farm Wholesale / Produce Market",
    donorPhone: "+1 (555) 345-6789",
    donorEmail: "contact@greengrocers.org",
    expiry: new Date(Date.now() + 72 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "100% Organic Vegan",
    notes: "Farm-fresh surplus from weekly produce intake. Graded A-quality.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  },
  {
    id: 103,
    item: "Banquet Steamed Basmati Rice, Dal Tadka and Veg Curry",
    category: "Cooked Meals",
    quantity: "45 servings",
    servings: 45,
    location: "Grand Plaza Hotel, Service Gate 3, Banquet Kitchen",
    city: "Metro Central",
    donor: "Grand Plaza Hotel & Suites",
    donorType: "Hotel / Banquet Dining",
    donorPhone: "+1 (555) 456-7890",
    donorEmail: "chef@grandplazahotel.com",
    expiry: new Date(Date.now() + 10 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Requested",
    receiver: "Hope Community Relief Shelter",
    receiverPhone: "+1 (555) 888-1212",
    receiverEmail: "shelter@hope.org",
    dietary: "Vegetarian / Halal",
    notes: "Maintained in temperature-controlled chafing dishes after lunch event.",
    urgency: "high",
    receiverApplication: {
      receiverName: "Hope Community Relief Shelter",
      receiverType: "Homeless Shelter & Night Kitchen",
      contactPerson: "Elena Vance (Shelter Director)",
      receiverPhone: "+1 (555) 888-1212",
      receiverEmail: "shelter@hope.org",
      deliveryAddress: "742 Evergreen Terrace, North Wing Meal Hall",
      beneficiaryCount: 45,
      vehicleType: "Volunteer Van Available",
      urgency: "Immediate - Dinner service tonight",
      receiverNotes: "Providing evening dinners for 45 unhoused residents tonight. Hot meals are urgently requested.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  },
  {
    id: 104,
    item: "Artisan Sourdough Loaves and French Croissants",
    category: "Bakery",
    quantity: "25 sourdough loaves & 40 butter croissants",
    servings: 65,
    location: "Sunrise Artisan Bakery, 104 High Street",
    city: "North Ward",
    donor: "Sunrise Artisan Bakery",
    donorType: "Bakery & Cafe",
    donorPhone: "+1 (555) 567-8901",
    donorEmail: "orders@sunrisebakery.com",
    expiry: new Date(Date.now() + 36 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Delivered",
    receiver: "Community Youth Kitchen",
    receiverPhone: "+1 (555) 999-4321",
    receiverEmail: "youth@communitykitchen.org",
    receiverNotes: "Received in great condition and distributed to 65 youth and families. Receipt verified.",
    dietary: "Vegetarian",
    notes: "Baked fresh today morning, bagged individually in breathable paper bakery bags.",
    urgency: "low",
    receiverApplication: {
      receiverName: "Community Youth Kitchen",
      receiverType: "Youth Support Kitchen",
      contactPerson: "Marcus Brody",
      receiverPhone: "+1 (555) 999-4321",
      receiverEmail: "youth@communitykitchen.org",
      deliveryAddress: "12 Youth Center Road",
      beneficiaryCount: 65,
      vehicleType: "Self-Pickup",
      urgency: "Standard",
      receiverNotes: "Daily breakfast and after-school program for underprivileged local teens.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    deliveryProof: "Received in great condition and distributed to 65 youth and families. Receipt verified.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString()
  },
  {
    id: 105,
    item: "Pasteurized Milk Cartons and Greek Probiotic Yogurt",
    category: "Dairy",
    quantity: "24 cartons (1L each) & 36 yogurt tubs",
    servings: 60,
    location: "Valley Cold Storage Hub, Bay 12",
    city: "South District",
    donor: "Valley Farm Dairy Co.",
    donorType: "Dairy Processing / Wholesale",
    donorPhone: "+1 (555) 678-9012",
    donorEmail: "dispatch@valleydairy.com",
    expiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Out for Pickup",
    receiver: "Saint Jude Community Pantry",
    receiverPhone: "+1 (555) 345-1234",
    receiverEmail: "pantry@stjude.org",
    dietary: "Gluten-Free Vegetarian",
    notes: "Refrigerated transport required. Temperature strictly 2-4°C.",
    urgency: "medium",
    driver: "David Kim (Volunteer Driver, Green Van 02)",
    receiverApplication: {
      receiverName: "Saint Jude Community Pantry",
      receiverType: "Community Food Pantry",
      contactPerson: "Sister Catherine",
      receiverPhone: "+1 (555) 345-1234",
      receiverEmail: "pantry@stjude.org",
      deliveryAddress: "88 Mission Street, Parish Hall",
      beneficiaryCount: 60,
      vehicleType: "Needs Volunteer Pickup",
      urgency: "Standard",
      receiverNotes: "Weekly food bag distribution for 60 low-income single-parent families.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString(),
    outForPickupAt: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 106,
    item: "Surplus Canned Black Beans, Sweet Corn and Crushed Tomatoes",
    category: "Packaged & Canned",
    quantity: "48 large commercial cans (800g each)",
    servings: 96,
    location: "Metro Wholesale Supermarket, Loading Bay 4",
    city: "East Harbor",
    donor: "Metro Retail Distribution",
    donorType: "Supermarket / Retail Chain",
    donorPhone: "+1 (555) 789-0123",
    donorEmail: "community@metromarket.com",
    expiry: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Out for Delivery",
    receiver: "Eastside Family Mission",
    receiverPhone: "+1 (555) 890-1234",
    receiverEmail: "dispatch@eastsidefamily.org",
    dietary: "Vegan / Non-Perishable",
    notes: "Surplus inventory from warehouse stock rotation. Cans unopened and sealed in flats.",
    urgency: "low",
    driver: "City Relief Courier Team (Van 04)",
    receiverApplication: {
      receiverName: "Eastside Family Mission",
      receiverType: "Family Shelter & Relief Hub",
      contactPerson: "Anthony Morales",
      receiverPhone: "+1 (555) 890-1234",
      receiverEmail: "dispatch@eastsidefamily.org",
      deliveryAddress: "405 Harbor Way, Warehouse 3",
      beneficiaryCount: 96,
      vehicleType: "Van Delivery",
      urgency: "Standard",
      receiverNotes: "Stocking emergency food reserve for 96 families in recovery programs.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 3.5).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 3600 * 1000 * 0.8).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  },
  {
    id: 107,
    item: "Mediterranean Grilled Lemon Herb Chicken & Roasted Potatoes",
    category: "Cooked Meals",
    quantity: "40 hot meal containers",
    servings: 40,
    location: "84 Ocean Boulevard, Kitchen Rear Entrance",
    city: "West District",
    donor: "Mediterranean Bistro & Grill",
    donorType: "Restaurant / Commercial Kitchen",
    donorPhone: "+1 (555) 432-8765",
    donorEmail: "kitchen@medbistro.com",
    expiry: new Date(Date.now() + 14 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Halal / High-Protein / Gluten-Conscious",
    notes: "Freshly prepared for evening conference event. Packed in heavy-duty heat-seal foil trays.",
    urgency: "high",
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
  },
  {
    id: 108,
    item: "Hydroponic Mixed Greens, Baby Spinach & Ripe Cluster Tomatoes",
    category: "Fresh Produce",
    quantity: "18 kgs (6 ventilated crates)",
    servings: 50,
    location: "Greenhouse Complex 5, River Road",
    city: "Riverside",
    donor: "Blue River Organics",
    donorType: "Urban Farm / Hydroponics",
    donorPhone: "+1 (555) 654-3210",
    donorEmail: "sales@blueriverorganics.com",
    expiry: new Date(Date.now() + 60 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Requested",
    receiver: "New Hope Women's Shelter",
    receiverPhone: "+1 (555) 777-6543",
    receiverEmail: "intake@newhopeshelter.org",
    dietary: "100% Organic Vegan / Raw",
    notes: "Harvested this morning. Crisp and refrigerated at 5°C.",
    urgency: "medium",
    receiverApplication: {
      receiverName: "New Hope Women's Shelter",
      receiverType: "Women & Children Emergency Shelter",
      contactPerson: "Maria Gonzalez",
      receiverPhone: "+1 (555) 777-6543",
      receiverEmail: "intake@newhopeshelter.org",
      deliveryAddress: "320 Maple Avenue, Resident Kitchen",
      beneficiaryCount: 50,
      vehicleType: "Needs Volunteer Pickup",
      urgency: "Lunch Service Tomorrow",
      receiverNotes: "Providing fresh salad and greens bar for 50 resident mothers and children.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString()
  },
  {
    id: 109,
    item: "Whole Wheat Sandwich Buns and Sliced Brioche Bread",
    category: "Bakery",
    quantity: "60 bun packs & 30 sliced sandwich loaves",
    servings: 90,
    location: "Industrial Park, Unit 8, Bakery Row",
    city: "North Ward",
    donor: "Golden Crust Commercial Bakery",
    donorType: "Commercial Bakery",
    donorPhone: "+1 (555) 321-7654",
    donorEmail: "dispatch@goldencrust.com",
    expiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Request Accepted",
    receiver: "Downtown Daylight Drop-in Center",
    receiverPhone: "+1 (555) 888-4422",
    receiverEmail: "coordinator@daylightcenter.org",
    dietary: "Vegetarian",
    notes: "Sealed packaging, ambient storage, high nutrition whole grain.",
    urgency: "medium",
    receiverApplication: {
      receiverName: "Downtown Daylight Drop-in Center",
      receiverType: "Daytime Homeless Center",
      contactPerson: "Arthur Pendelton",
      receiverPhone: "+1 (555) 888-4422",
      receiverEmail: "coordinator@daylightcenter.org",
      deliveryAddress: "15 Central Square, Lower Level",
      beneficiaryCount: 90,
      vehicleType: "Van Delivery Requested",
      urgency: "Breakfast Service",
      receiverNotes: "Will prepare 90 morning sandwiches for drop-in clients.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 1.2).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 9).toISOString()
  },
  {
    id: 110,
    item: "Farm Fresh Cheddar Cheese Blocks and Cottage Cheese",
    category: "Dairy",
    quantity: "20 cheese blocks (500g) & 25 cottage cheese tubs",
    servings: 70,
    location: "Dairy Distribution Depot, Dock 3",
    city: "South District",
    donor: "Daily Fresh Dairy Processing",
    donorType: "Dairy Processing",
    donorPhone: "+1 (555) 432-1098",
    donorEmail: "logistics@dailyfreshdairy.com",
    expiry: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Picked Up",
    receiver: "Grace Senior Community Kitchen",
    receiverPhone: "+1 (555) 666-3311",
    receiverEmail: "kitchen@graceseniors.org",
    dietary: "Vegetarian / High-Calcium",
    notes: "Keep chilled at 2-6°C. Insulated thermal blankets used during transit.",
    urgency: "medium",
    driver: "Officer Ray Reynolds (Transit Logistics Van #1)",
    receiverApplication: {
      receiverName: "Grace Senior Community Kitchen",
      receiverType: "Elderly Care & Nutrition Hub",
      contactPerson: "Brenda Taylor",
      receiverPhone: "+1 (555) 666-3311",
      receiverEmail: "kitchen@graceseniors.org",
      deliveryAddress: "510 Elderberry Way, Community Hall",
      beneficiaryCount: 70,
      vehicleType: "Refrigerated Van",
      urgency: "Standard",
      receiverNotes: "Nutritious dairy products for 70 low-income senior citizens in our lunch meal initiative.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    outForPickupAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 0.8).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString()
  },
  {
    id: 111,
    item: "Whole Grain Penne Pasta, Brown Rice and Rolled Oats",
    category: "Packaged & Canned",
    quantity: "35 bulk packs (1kg each)",
    servings: 105,
    location: "450 Oakwood Avenue, Storage Room C",
    city: "Midtown",
    donor: "Oakwood Community Market",
    donorType: "Grocery Co-op",
    donorPhone: "+1 (555) 987-1234",
    donorEmail: "info@oakwoodmarket.org",
    expiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegan / High-Fiber",
    notes: "Pantry staples with pristine packaging. Perfect for community soup kitchens.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString()
  },
  {
    id: 112,
    item: "Cold-Pressed Valencia Orange and Green Apple Juice Bottles",
    category: "Beverages",
    quantity: "60 individual glass bottles (330ml)",
    servings: 60,
    location: "Pier 9 Juice Kiosk & Bottling, Bay 1",
    city: "East Harbor",
    donor: "Ocean Breeze Juicery",
    donorType: "Beverage Producer",
    donorPhone: "+1 (555) 765-4321",
    donorEmail: "orders@oceanbreezejuice.com",
    expiry: new Date(Date.now() + 30 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Out for Delivery",
    receiver: "Pine Valley Children's After-School Club",
    receiverPhone: "+1 (555) 555-8765",
    receiverEmail: "activities@pinevalleykids.org",
    dietary: "100% Pure Fruit Vegan / No Added Sugar",
    notes: "Freshly cold-pressed fruit juices in sealed recyclable bottles. Chilled.",
    urgency: "high",
    driver: "David Kim (Green Relief Electric Van)",
    receiverApplication: {
      receiverName: "Pine Valley Children's After-School Club",
      receiverType: "Youth Support Organization",
      contactPerson: "Principal Lisa Chen",
      receiverPhone: "+1 (555) 555-8765",
      receiverEmail: "activities@pinevalleykids.org",
      deliveryAddress: "77 Pine Road, Gymnasium Wing",
      beneficiaryCount: 60,
      vehicleType: "Electric Van Delivery",
      urgency: "Afternoon Snack Session",
      receiverNotes: "Healthy vitamin-rich refreshments for 60 children attending our educational after-school camp.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 2.8).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 1.4).toISOString(),
    outForDeliveryAt: new Date(Date.now() - 3600 * 1000 * 0.4).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString()
  },
  {
    id: 113,
    item: "Nutritious Roasted Vegetable and Lentil Hearty Stew",
    category: "Cooked Meals",
    quantity: "30 liters in 3 thermal insulated urns",
    servings: 60,
    location: "100 Convention Plaza, Loading Dock B",
    city: "Metro Central",
    donor: "Starlight Convention Center",
    donorType: "Convention Banquet / Caterer",
    donorPhone: "+1 (555) 876-5432",
    donorEmail: "catering@starlightcenter.org",
    expiry: new Date(Date.now() + 18 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Vegan / Gluten-Free",
    notes: "Rich, hot vegetable lentil stew prepared today at noon in commercial soup urns. Insulated.",
    urgency: "high",
    createdAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString()
  },
  {
    id: 114,
    item: "Fresh Seasonal Oranges, Bananas and Seedless Grapes",
    category: "Fresh Produce",
    quantity: "35 kgs (4 assorted fruit boxes)",
    servings: 75,
    location: "Market Terminal 3, Stand 11",
    city: "West District",
    donor: "City Harvest Orchards",
    donorType: "Agricultural Produce Co-op",
    donorPhone: "+1 (555) 543-2109",
    donorEmail: "dispatch@cityharvestorchards.com",
    expiry: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Request Accepted",
    receiver: "Safe Haven Homeless Clinic & Shelter",
    receiverPhone: "+1 (555) 444-1122",
    receiverEmail: "clinic@safehavenshelter.org",
    dietary: "Raw Vegan / Vitamin C Rich",
    notes: "Sweet, juicy eating fruit ready for distribution. Cleaned and pre-sorted.",
    urgency: "medium",
    receiverApplication: {
      receiverName: "Safe Haven Homeless Clinic & Shelter",
      receiverType: "Emergency Clinic & Shelter",
      contactPerson: "Dr. Robert Harris",
      receiverPhone: "+1 (555) 444-1122",
      receiverEmail: "clinic@safehavenshelter.org",
      deliveryAddress: "900 Hope Boulevard, Annex C",
      beneficiaryCount: 75,
      vehicleType: "Van Delivery Requested",
      urgency: "Immediate",
      receiverNotes: "Distributing nutritious fruit bags to 75 unhoused patients visiting our medical outreach clinic.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 3.5).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 3.5).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 1.8).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString()
  },
  {
    id: 115,
    item: "Assorted Bagels, Blueberry Muffins and Multigrain Rolls",
    category: "Bakery",
    quantity: "45 bagels, 35 muffins, 50 rolls",
    servings: 80,
    location: "220 Central Boulevard",
    city: "Metro Central",
    donor: "Skyline Deli & Roasters",
    donorType: "Bakery & Deli",
    donorPhone: "+1 (555) 210-9876",
    donorEmail: "baking@skylinedeli.com",
    expiry: new Date(Date.now() + 28 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Out for Pickup",
    receiver: "Saint Vincent Veterans Care Home",
    receiverPhone: "+1 (555) 333-8899",
    receiverEmail: "dispatch@stvincentsveterans.org",
    dietary: "Vegetarian",
    notes: "Packed in sanitized food-grade bakery boxes, organized by pastry type.",
    urgency: "medium",
    driver: "Marcus Vance (Share The Bite Fleet Van #2)",
    receiverApplication: {
      receiverName: "Saint Vincent Veterans Care Home",
      receiverType: "Veterans Supportive Housing",
      contactPerson: "Captain Thomas Ross",
      receiverPhone: "+1 (555) 333-8899",
      receiverEmail: "dispatch@stvincentsveterans.org",
      deliveryAddress: "410 Patriot Way, Dining Pavilion",
      beneficiaryCount: 80,
      vehicleType: "Fleet Van Pickup",
      urgency: "Standard",
      receiverNotes: "Morning breakfast and coffee fellowship for 80 resident military veterans.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    outForPickupAt: new Date(Date.now() - 3600 * 1000 * 0.9).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 9).toISOString()
  },
  {
    id: 116,
    item: "Unsweetened Almond Milk and Oat Barista Cartons",
    category: "Beverages",
    quantity: "40 cartons (1L each)",
    servings: 80,
    location: "15 Roastery Way, Unit 4",
    city: "Midtown",
    donor: "Artisan Coffee Roasters Guild",
    donorType: "Cafe Cooperative",
    donorPhone: "+1 (555) 109-8765",
    donorEmail: "supplies@roastersguild.com",
    expiry: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Requested",
    receiver: "Community Table Interfaith Kitchen",
    receiverPhone: "+1 (555) 222-7766",
    receiverEmail: "table@interfaithkitchen.org",
    dietary: "Plant-Based Dairy-Free / Vegan",
    notes: "Shelf-stable ambient storage cartons. Perfect for vegan/lactose-intolerant guests.",
    urgency: "low",
    receiverApplication: {
      receiverName: "Community Table Interfaith Kitchen",
      receiverType: "Interfaith Community Kitchen",
      contactPerson: "Rabbi Jonathan & Pastor Grace",
      receiverPhone: "+1 (555) 222-7766",
      receiverEmail: "table@interfaithkitchen.org",
      deliveryAddress: "128 Unity Avenue, Basement Kitchen",
      beneficiaryCount: 80,
      vehicleType: "Volunteer Vehicle Available",
      urgency: "Weekly Dinner",
      receiverNotes: "Supplying plant-based milk alternatives for 80 attendees with dietary sensitivities.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString(),
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    id: 117,
    item: "Individual Shelf-Stable Tuna Salad and Crackers Kits",
    category: "Packaged & Canned",
    quantity: "55 ready-to-eat meal kits",
    servings: 55,
    location: "Port Warehouse 6, Gate A",
    city: "East Harbor",
    donor: "Harborview Marine & Grocers",
    donorType: "Food Distributor / Marine Wholesaler",
    donorPhone: "+1 (555) 345-6712",
    donorEmail: "provisions@harborviewgrocers.com",
    expiry: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "High-Protein / Non-Perishable",
    notes: "Complete individual kits including spoon and napkin. Zero refrigeration or cooking required.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString()
  },
  {
    id: 118,
    item: "School District Surplus Nutrition Packs: Milk, Apples & Sandwiches",
    category: "Cooked Meals",
    quantity: "65 balanced pre-packed student lunches",
    servings: 65,
    location: "School District Kitchen Depot, 90 School Lane",
    city: "South District",
    donor: "Central School District Kitchen",
    donorType: "Educational Institution",
    donorPhone: "+1 (555) 901-2345",
    donorEmail: "nutrition@centralschooldistrict.edu",
    expiry: new Date(Date.now() + 20 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Delivered",
    receiver: "West End Boys & Girls Club",
    receiverPhone: "+1 (555) 111-9988",
    receiverEmail: "info@westendbgclub.org",
    dietary: "Nut-Free / Balanced Student Meal",
    notes: "Each pack contains turkey & cheese sandwich, organic apple, and 250ml milk carton.",
    urgency: "high",
    receiverApplication: {
      receiverName: "West End Boys & Girls Club",
      receiverType: "Youth Development Center",
      contactPerson: "Director Samuel Lee",
      receiverPhone: "+1 (555) 111-9988",
      receiverEmail: "info@westendbgclub.org",
      deliveryAddress: "350 West Boulevard, Recreation Hall",
      beneficiaryCount: 65,
      vehicleType: "Direct Delivery",
      urgency: "Immediate",
      receiverNotes: "Emergency after-school meal program for 65 neighborhood youths.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    deliveryProof: "Received 65 student nutrition packs. Handed out to club members at 4:30 PM. Signed: Director Samuel Lee.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
  },
  {
    id: 119,
    item: "Organic Free-Range Eggs and Farm Butter Bricks",
    category: "Dairy",
    quantity: "30 dozen eggs (360 eggs) & 20 butter packages",
    servings: 90,
    location: "Highland Farm Storehouse, Bay 7",
    city: "Riverside",
    donor: "Highland Farm Cooperative",
    donorType: "Farm Cooperative",
    donorPhone: "+1 (555) 890-5678",
    donorEmail: "orders@highlandfarmcoop.com",
    expiry: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Delivered",
    receiver: "Mercy Meal Kitchen",
    receiverPhone: "+1 (555) 777-3344",
    receiverEmail: "kitchen@mercymeal.org",
    dietary: "Vegetarian / Protein-Rich",
    notes: "Cartoned Grade-AA eggs and salted butter bricks. Maintained at 4°C in transit.",
    urgency: "low",
    receiverApplication: {
      receiverName: "Mercy Meal Kitchen",
      receiverType: "Soup Kitchen & Food Pantry",
      contactPerson: "Sister Teresa",
      receiverPhone: "+1 (555) 777-3344",
      receiverEmail: "kitchen@mercymeal.org",
      deliveryAddress: "600 Saint Ann Street, Pantry Gate",
      beneficiaryCount: 90,
      vehicleType: "Volunteer Refrigerated Van",
      urgency: "Standard",
      receiverNotes: "Essential breakfast cooking staples for 90 meals served daily to families in need.",
      appliedAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString()
    },
    appliedAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    acceptedAt: new Date(Date.now() - 3600 * 1000 * 11).toISOString(),
    pickedUpAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString(),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    deliveryProof: "Delivered and inspected. Temperature 3.8°C verified. Stored in walk-in cooler. Signed: Sister Teresa.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString()
  },
  {
    id: 120,
    item: "Hydration Electrolyte Coconut Water and Fruit Infusions",
    category: "Beverages",
    quantity: "72 tetra-pak cartons (500ml)",
    servings: 72,
    location: "South Logistic Hub, Gate 9",
    city: "South District",
    donor: "Pure Life Beverage Distributors",
    donorType: "Beverage Distributor",
    donorPhone: "+1 (555) 678-1230",
    donorEmail: "operations@purelifebev.com",
    expiry: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: "Available",
    dietary: "Organic Vegan / Electrolyte Rich",
    notes: "Sealed cartons in protective shrink-wrap cases. Ambient storage. High potassium hydration.",
    urgency: "low",
    createdAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
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
  let found = users.find(u => u.email.toLowerCase() === cleanEmail);

  // Fallback for admin email variations
  if (!found && (cleanEmail === 'admin@foodshare.org' || cleanEmail === 'admin@sharethebite.org' || cleanEmail === 'admin@share the bite.org')) {
    found = users.find(u => u.role === 'admin');
  }

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
      if (lsBackup && Array.isArray(lsBackup) && lsBackup.length >= 20) {
        donations = lsBackup;
        const writeTx = db.transaction(STORE_DONATIONS, 'readwrite');
        const writeStore = writeTx.objectStore(STORE_DONATIONS);
        donations.forEach(item => writeStore.put(item));
        await logActivity('INDEXEDDB_RESTORED', `Restored ${donations.length} items from LocalStorage backup into IndexedDB.`);
      } else {
        // Both are empty or insufficient: Seed with initial 20 Mock SDG 2 Data
        donations = [...initialMockDonations];
        const seedTx = db.transaction(STORE_DONATIONS, 'readwrite');
        const seedStore = seedTx.objectStore(STORE_DONATIONS);
        donations.forEach(item => seedStore.put(item));
        writeLocalStorage(LS_KEY_DONATIONS, donations);
        await logActivity('INITIAL_SEED', `Seeded database with ${donations.length} SDG 2 Share The Bite listings.`);
      }
    } else if (donations.length < 20) {
      // Auto-upgrade: If browser has older dataset (e.g. earlier 6 items), upgrade with all 20 sample items
      const existingIds = new Set(donations.map(d => d.id));
      const missing = initialMockDonations.filter(m => !existingIds.has(m.id));
      const upgradedList = (donations.length <= 6) ? [...initialMockDonations] : [...donations, ...missing];

      const writeTx = db.transaction(STORE_DONATIONS, 'readwrite');
      const writeStore = writeTx.objectStore(STORE_DONATIONS);
      writeStore.clear();
      upgradedList.forEach(item => writeStore.put(item));
      writeLocalStorage(LS_KEY_DONATIONS, upgradedList);
      donations = upgradedList;
      await logActivity('DATABASE_UPGRADE', `Automatically upgraded storage to ${donations.length} comprehensive SDG-2 surplus food listings.`);
    } else {
      writeLocalStorage(LS_KEY_DONATIONS, donations);
    }
  } catch (err) {
    console.warn('IndexedDB unavailable or blocked. Using LocalStorage primary mode:', err);
    let lsBackup = readLocalStorage(LS_KEY_DONATIONS, null);
    if (!lsBackup || lsBackup.length < 20) {
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
    servings: itemData.servings ? Number(itemData.servings) : 10,
    location: itemData.location || "Community Center",
    city: itemData.city || "Metro Central",
    donor: itemData.donor || "Anonymous Citizen / Partner",
    donorType: itemData.donorType || "Community Partner",
    donorPhone: itemData.donorPhone || "",
    donorEmail: itemData.donorEmail || "",
    expiry: itemData.expiry || new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    status: itemData.status || "Available",
    dietary: itemData.dietary || "Standard Wholesome",
    notes: itemData.notes || "",
    urgency: itemData.urgency || "medium",
    receiver: itemData.receiver || null,
    receiverPhone: itemData.receiverPhone || null,
    receiverEmail: itemData.receiverEmail || null,
    receiverApplication: itemData.receiverApplication || null,
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
    `New public donation listed: "${newItem.item}" (${newItem.quantity}) by ${newItem.donor} (${newItem.donorType}).`,
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

// ----------------------------------------------------------------------------
// Comprehensive Service Requests Lifecycle: Apply, Accept, Reject, Pickup, Delivery
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
    `Receiver "${receiverApp.receiverName}" applied for donation #${numId} ("${updated?.item}") to serve ${receiverApp.beneficiaryCount} beneficiaries.`,
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
    adminNotes: adminNotes || 'Request approved by System Administration. Ready for pickup dispatch.'
  };

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'REQUEST_ACCEPTED',
    `Admin accepted allocation request for donation #${numId} to "${updated?.receiver}".`,
    'Admin Dispatcher'
  );

  return updated;
}

export async function rejectRequest(id, rejectionReason = '') {
  const numId = Number(id);
  const now = new Date().toISOString();
  const existing = await getDonationById(numId);
  const previousReceiver = existing?.receiver || 'Applicant';

  const updates = {
    status: 'Available',
    receiver: null,
    receiverPhone: null,
    receiverEmail: null,
    receiverApplication: null,
    lastRejection: {
      rejectedReceiver: previousReceiver,
      reason: rejectionReason || 'Request declined due to logistical capacity or geographical constraints.',
      rejectedAt: now
    }
  };

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'REQUEST_REJECTED',
    `Admin rejected request from "${previousReceiver}" for donation #${numId}. Item reset to "Available". Reason: ${updates.lastRejection.reason}`,
    'Admin Dispatcher'
  );

  return updated;
}

export async function dispatchForPickup(id, driverInfo = '') {
  const numId = Number(id);
  const now = new Date().toISOString();
  const updates = {
    status: 'Out for Pickup',
    outForPickupAt: now,
    driver: driverInfo || 'Assigned Logistics Driver'
  };

  const updated = await updateDonation(numId, updates);

  await logActivity(
    'OUT_FOR_PICKUP',
    `Driver dispatched for pickup of donation #${numId} from donor "${updated?.donor}".`,
    'Logistics Team'
  );

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

  await logActivity(
    'FOOD_PICKED_UP',
    `Food donation #${numId} successfully collected from donor "${updated?.donor}".`,
    'Logistics Team'
  );

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

  await logActivity(
    'OUT_FOR_DELIVERY',
    `Donation #${numId} is out for delivery en route to receiver "${updated?.receiver}".`,
    'Logistics Team'
  );

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

  await logActivity(
    'FOOD_DELIVERED',
    `Donation #${numId} successfully delivered to receiver "${updated?.receiver}". ${updated?.servings || 10} portions rescued!`,
    'Logistics Team'
  );

  return updated;
}

// Backwards-compatible claim helper
export async function claimDonation(id, receiverInfo) {
  return applyFoodRequest(id, receiverInfo);
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
    appName: "Share The Bite UN SDG-2 Platform",
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
  a.download = `Share The Bite_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
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
