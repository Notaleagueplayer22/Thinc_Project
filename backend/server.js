require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// สร้าง Schema สำหรับ User
const UserSchema = new mongoose.Schema({
    email: String,
    studentId: String,
    password: String,
});

const User = mongoose.model("User", UserSchema);

// 🟢 API ลงทะเบียน
app.post("/register", async (req, res) => {
    const { email, studentId, password } = req.body;
    
    // เช็คว่ามี email หรือ studentId ซ้ำหรือไม่
    const existingUser = await User.findOne({ $or: [{ email }, { studentId }] });
    if (existingUser) return res.status(400).json({ message: "Email or Student ID already exists" });

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, studentId, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
});

// 🟢 API เข้าสู่ระบบ
app.post("/login", async (req, res) => {
    const { email, studentId, password } = req.body;
    
    // ค้นหาผู้ใช้โดย email หรือ studentId
    const user = await User.findOne({ $or: [{ email }, { studentId }] });

    if (!user) return res.status(400).json({ message: "User not found" });

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // สร้าง Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// 🟢 API เช็ค Token (ป้องกันหน้าเพลย์ลิสต์ให้เฉพาะคนล็อกอิน)
app.get("/protected", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token is invalid" });
        res.json({ message: "Protected content", userId: decoded.userId });
    });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
