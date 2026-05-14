// ─── MENU MANAGER PAGE ───────────────────────────────────────────────────────

import { useState } from "react";
import { MENU_CATEGORIES, BLANK_MENU_ITEM } from "../constants/data";
import { fmt } from "../utils/helpers";
import { Btn, Input, Select } from "../components/ui";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../utils/api";

// ── Edit / Add modal ──────────────────────────────────────────────────────────
function MenuItemModal({ item, isNew, onSave, onClose, T }) {
  const [form, setForm] = useState({ ...item });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <>
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,.75)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: T.surface,
            border: `1px solid ${T.borderHi}`,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <h3
              className="font-black text-white"
              style={{ fontFamily: "'Georgia',serif" }}
            >
              {isNew ? "Add Menu Item" : "Edit Item"}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: `${T.orange}18`,
                border: "none",
                color: T.orange,
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Image preview */}
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="w-full h-32 object-cover rounded-xl"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Item Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Jollof Rice"
              />
              <Input
                label="Emoji"
                value={form.emoji}
                onChange={(e) => set("emoji", e.target.value)}
                placeholder="🍛"
              />
            </div>

            <Select
              label="Category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {MENU_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Unit Price (₦)"
                type="number"
                value={form.unitPrice}
                onChange={(e) => set("unitPrice", Number(e.target.value))}
              />
              <Select
                label="Unit Label"
                value={form.unitLabel}
                onChange={(e) => set("unitLabel", e.target.value)}
              >
                {[
                  "plate",
                  "wrap",
                  "stick",
                  "cup",
                  "bowl",
                  "piece",
                  "portion",
                ].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </Select>
            </div>

            <Input
              label="Image URL"
              value={form.img}
              onChange={(e) => set("img", e.target.value)}
              placeholder="https://…"
            />

            <Input
              label="Description"
              value={form.desc || ""}
              onChange={(e) => set("desc", e.target.value)}
              placeholder="Brief description of the item"
            />

            {/* Availability toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: form.available
                    ? T.orange
                    : "rgba(255,255,255,.15)",
                }}
                onClick={() => set("available", !form.available)}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                  style={{ left: form.available ? "calc(100% - 18px)" : 2 }}
                />
              </div>
              <span className="text-sm text-white">Available for ordering</span>
            </label>

            <div className="flex gap-3 pt-2">
              <Btn onClick={() => onSave(form)} style={{ flex: 1 }}>
                {isNew ? "Add to Menu" : "Save Changes"}
              </Btn>
              <Btn variant="outline" onClick={onClose}>
                Cancel
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Menu Manager page ─────────────────────────────────────────────────────────
export default function MenuManager({ items, onSave, showToast, T }) {
  const [menu, setMenu] = useState(items);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("All");

  const CATS = ["All", ...Array.from(new Set(menu.map((m) => m.category)))];

  const filtered = menu.filter((m) => {
    const ms = m.name.toLowerCase().includes(search.toLowerCase());
    const mc = catFilter === "All" || m.category === catFilter;
    return ms && mc;
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing({ ...BLANK_MENU_ITEM, id: Date.now() });
    setIsNew(true);
  };

  const openEdit = (item) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const saveItem = async (item) => {
    if (!item.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (item.unitPrice <= 0) {
      showToast("Price must be > 0", "error");
      return;
    }

    try {
      if (isNew) {
        // Create new item via API
        await createMenuItem({
          name: item.name,
          emoji: item.emoji,
          category: item.category,
          unitPrice: item.unitPrice,
          unitLabel: item.unitLabel,
          img: item.img,
          desc: item.desc || "",
          available: item.available !== false,
        });
        const next = [...menu, { ...item, id: Date.now() }];
        setMenu(next);
        onSave(next);
        showToast("✅ Item added!", "success");
      } else {
        // Update existing item via API
        await updateMenuItem(item.id, {
          name: item.name,
          emoji: item.emoji,
          category: item.category,
          unitPrice: item.unitPrice,
          unitLabel: item.unitLabel,
          img: item.img,
          desc: item.desc || "",
          available: item.available,
        });
        const next = menu.map((m) => (m.id === item.id ? item : m));
        setMenu(next);
        onSave(next);
        showToast("✅ Item updated!", "success");
      }
      setEditing(null);
    } catch (error) {
      console.error("Failed to save item:", error);
      showToast("❌ Failed to save item", "error");
    }
  };

  const toggleAvail = async (id) => {
    const item = menu.find((m) => m.id === id);
    if (!item) return;

    try {
      await updateMenuItem(id, {
        ...item,
        available: !item.available,
      });
      const next = menu.map((m) =>
        m.id === id ? { ...m, available: !m.available } : m,
      );
      setMenu(next);
      onSave(next);
    } catch (error) {
      console.error("Failed to toggle availability:", error);
      showToast("❌ Failed to update item", "error");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await deleteMenuItem(id);
      const next = menu.filter((m) => m.id !== id);
      setMenu(next);
      onSave(next);
      showToast("🗑 Item deleted", "info");
    } catch (error) {
      console.error("Failed to delete item:", error);
      showToast("❌ Failed to delete item", "error");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Georgia',serif" }}
          >
            Menu Manager
          </h2>
          <p className="text-sm" style={{ color: T.muted }}>
            {menu.length} items · {menu.filter((m) => m.available).length}{" "}
            available
          </p>
        </div>
        <Btn onClick={openAdd}>+ Add Item</Btn>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search menu…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            color: T.text,
            fontFamily: "inherit",
          }}
        />
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background:
                catFilter === c
                  ? `linear-gradient(135deg,${T.orange},${T.orangeD})`
                  : T.card,
              color: catFilter === c ? "#fff" : T.muted,
              border: `1px solid ${catFilter === c ? "transparent" : T.border}`,
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1"
            style={{
              background: T.card,
              border: `1px solid ${item.available ? T.border : "rgba(239,68,68,.2)"}`,
            }}
          >
            {/* Image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={
                  item.img ||
                  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400"
                }
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400")
                }
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(0,0,0,.7),transparent)",
                }}
              />
              <span className="absolute top-2 right-2 text-xl">
                {item.emoji}
              </span>
              <span
                className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: item.available
                    ? "rgba(34,197,94,.25)"
                    : "rgba(239,68,68,.25)",
                  color: item.available ? T.green : T.red,
                }}
              >
                {item.available ? "● Available" : "● Unavailable"}
              </span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col">
              <h4 className="font-bold text-white text-sm mb-0.5">
                {item.name}
              </h4>
              <p className="text-xs mb-1" style={{ color: T.muted }}>
                {item.category}
              </p>
              <p
                className="font-black mb-3"
                style={{ color: T.orange, fontFamily: "'Georgia',serif" }}
              >
                {fmt(item.unitPrice)}{" "}
                <span
                  className="text-xs font-normal"
                  style={{ color: T.muted }}
                >
                  / {item.unitLabel}
                </span>
              </p>

              <div className="flex gap-2 mt-auto">
                <Btn small variant="ghost" onClick={() => openEdit(item)}>
                  Edit
                </Btn>
                <Btn
                  small
                  variant="outline"
                  onClick={() => toggleAvail(item.id)}
                >
                  {item.available ? "Hide" : "Show"}
                </Btn>
                <Btn small variant="danger" onClick={() => deleteItem(item.id)}>
                  🗑
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add modal */}
      {editing && (
        <MenuItemModal
          item={editing}
          isNew={isNew}
          onSave={saveItem}
          onClose={() => setEditing(null)}
          T={T}
        />
      )}
    </div>
  );
}
