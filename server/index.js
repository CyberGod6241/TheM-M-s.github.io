require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "food_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.API_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  const adminHeader = req.headers["x-admin"];
  if (adminHeader !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden: admin only" });
  }
  next();
};

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      console.error("Database test query failed:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }
    res.json({ dbResult: results[0].result });
  });
});

app.get("/api/menu", (req, res) => {
  const sql =
    "SELECT id, name, description, price, category, image_url AS imageUrl, is_available AS isAvailable FROM menu_items WHERE is_available = 1 ORDER BY category, name";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch menu items:", err);
      return res.status(500).json({ error: "Failed to load menu" });
    }
    res.json({ menu: results });
  });
});

app.post("/api/orders", authenticate, (req, res) => {
  const { customerName, customerPhone, customerAddress, items, total } =
    req.body;
  if (
    !customerName ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    total == null
  ) {
    return res.status(400).json({ error: "Missing order data" });
  }

  const orderSql =
    "INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  const orderValues = [
    customerName,
    customerPhone || null,
    customerAddress || null,
    total,
    "pending",
  ];

  db.query(orderSql, orderValues, (err, orderResult) => {
    if (err) {
      console.error("Failed to create order:", err);
      return res.status(500).json({ error: "Could not place order" });
    }

    const orderId = orderResult.insertId;
    const itemRows = items.map((item) => [
      orderId,
      item.menuItemId,
      item.quantity,
      item.price,
    ]);
    const itemsSql =
      "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?";

    db.query(itemsSql, [itemRows], (itemsErr) => {
      if (itemsErr) {
        console.error("Failed to insert order items:", itemsErr);
        return res.status(500).json({ error: "Order saved but items failed" });
      }
      res.status(201).json({ orderId, message: "Order placed successfully" });
    });
  });
});

app.post("/api/admin/menu", authenticate, authorizeAdmin, (req, res) => {
  const { name, description, price, category, imageUrl, isAvailable } =
    req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const sql =
    "INSERT INTO menu_items (name, description, price, category, image_url, is_available, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
  const values = [
    name,
    description || null,
    price,
    category || null,
    imageUrl || null,
    isAvailable ? 1 : 0,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Failed to add menu item:", err);
      return res.status(500).json({ error: "Could not create menu item" });
    }
    res
      .status(201)
      .json({ menuItemId: result.insertId, message: "Menu item created" });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
