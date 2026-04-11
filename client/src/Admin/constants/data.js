// ─── APP-WIDE CONSTANTS & SEED DATA ──────────────────────────────────────────

export const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const MENU_CATEGORIES = [
  "Rice & Swallows",
  "Soups",
  "Protein & Grills",
  "Snacks & Drinks",
];

export const SEED_MENU = [
  { id: 1,  name: "Jollof Rice",      emoji: "🍛", category: "Rice & Swallows",  unitPrice: 2500, unitLabel: "plate",  available: true,  img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" },
  { id: 2,  name: "Fried Rice",       emoji: "🍚", category: "Rice & Swallows",  unitPrice: 2500, unitLabel: "plate",  available: true,  img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400" },
  { id: 3,  name: "Egusi Soup",       emoji: "🥘", category: "Soups",            unitPrice: 1500, unitLabel: "wrap",   available: true,  img: "https://images.unsplash.com/photo-1612392062422-c26a5e898793?w=400" },
  { id: 4,  name: "Amala & Ewedu",    emoji: "🫙", category: "Rice & Swallows",  unitPrice: 2700, unitLabel: "plate",  available: true,  img: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400" },
  { id: 5,  name: "Pounded Yam",      emoji: "🫕", category: "Rice & Swallows",  unitPrice: 3000, unitLabel: "plate",  available: false, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400" },
  { id: 6,  name: "Suya",             emoji: "🍢", category: "Protein & Grills", unitPrice: 500,  unitLabel: "stick",  available: true,  img: "https://images.unsplash.com/photo-1544025162-d76538780987?w=400" },
  { id: 7,  name: "Banga Soup",       emoji: "🥣", category: "Soups",            unitPrice: 1700, unitLabel: "wrap",   available: true,  img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400" },
  { id: 8,  name: "Okra Soup",        emoji: "🫘", category: "Soups",            unitPrice: 1500, unitLabel: "wrap",   available: true,  img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400" },
  { id: 9,  name: "Doughnuts",        emoji: "🍩", category: "Snacks & Drinks",  unitPrice: 300,  unitLabel: "piece",  available: true,  img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400" },
  { id: 10, name: "Zobo / Kunu",      emoji: "🧃", category: "Snacks & Drinks",  unitPrice: 500,  unitLabel: "cup",    available: true,  img: "https://images.unsplash.com/photo-1534353341046-2f57b5e81ea0?w=400" },
  { id: 11, name: "Fruit Salad",      emoji: "🍉", category: "Snacks & Drinks",  unitPrice: 800,  unitLabel: "bowl",   available: true,  img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400" },
  { id: 12, name: "Chinese Rice",     emoji: "🥡", category: "Rice & Swallows",  unitPrice: 2800, unitLabel: "plate",  available: false, img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400" },
];

// ── Generate realistic seed orders ────────────────────────────────────────────
const _names = ["Amara Obi","Tunde Bello","Ngozi Adeyemi","Emeka Nwosu","Fatima Aliyu","Bola Adekunle","Chidi Okeke","Yemi Abiodun","Kemi Fasanya","Ola Ibrahim"];
const _areas = ["Ring Road","Bodija","Agodi","Challenge","Mokola","Dugbe","Iwo Road","Ojoo","Eleyele","Apata"];

function generateOrder(id) {
  const items = SEED_MENU.slice(0, 3 + (id % 4)).map(m => ({
    ...m,
    qty:   1 + (id % 3),
    price: m.unitPrice * (1 + (id % 3)),
  }));
  return {
    id:       `KCH-${1000 + id}`,
    customer: _names[id % _names.length],
    phone:    `080${26000000 + id * 137}`,
    address:  `${10 + id} ${_areas[id % _areas.length]}, Ibadan`,
    type:     id % 3 === 0 ? "Pickup" : "Delivery",
    status:   STATUSES[id % STATUSES.length],
    items,
    total:    items.reduce((s, i) => s + i.price, 0),
    note:     id % 4 === 0 ? "No pepper please" : "",
    time:     new Date(Date.now() - id * 3_600_000).toISOString(),
  };
}

export const SEED_ORDERS = Array.from({ length: 24 }, (_, i) => generateOrder(i));

export const BLANK_MENU_ITEM = {
  id:         0,
  name:       "",
  emoji:      "🍽️",
  category:   "Rice & Swallows",
  unitPrice:  1000,
  unitLabel:  "plate",
  available:  true,
  img:        "",
};
