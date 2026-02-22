const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== CẤU HÌNH GIẢI =====
let prizes = [
  { name: "Giải Lộc Lá", value: "100.000đ", qty: 1 },
  { name: "Giải Chồi Xuân ", value: "50.000đ", qty: 3 },
  { name: "Giải Sương Mai ", value: "30.000đ", qty: 5 },
  { name: "Giải Đào Phai ", value: "10.000đ", qty: 10 },
  { name: "Giải Tươi Mát ", value: "20.000đ", qty: 5 },
  { name: "Giải Vui Vẻ", value: "01 Bao cao su Durex", qty: 1 }
];

let usedNames = new Set();
let usedDevices = new Set();
let logs = [];

// ===== BỐC LÌ XÌ =====
app.post("/draw", (req, res) => {
  const { name, deviceId } = req.body;

  if (!name || !deviceId)
    return res.json({ error: "Thiếu thông tin" });

  if (usedNames.has(name))
    return res.json({ error: "Tên này đã bốc rồi" });

  if (usedDevices.has(deviceId))
    return res.json({ error: "Thiết bị này đã bốc rồi" });

  let pool = [];
  prizes.forEach(p => {
    for (let i = 0; i < p.qty; i++) pool.push(p);
  });

  if (pool.length === 0)
    return res.json({ error: "Đã hết lì xì" });

  const prize = pool[Math.floor(Math.random() * pool.length)];
  prize.qty--;

  usedNames.add(name);
  usedDevices.add(deviceId);

  logs.push({ name, prize: prize.name, value: prize.value, time: new Date() });

  res.json(prize);
});

// ===== ADMIN XEM KẾT QUẢ =====
app.get("/result", (req, res) => {
  res.json(logs);
});

app.listen(PORT, () => console.log("🎊 Lì xì online đã chạy"));
