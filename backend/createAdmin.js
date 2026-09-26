const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await Admin.findOne({
            email: "admin@crm.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = new Admin({
            name: "CRM Admin",
            email: "admin@crm.com",
            password: hashedPassword
        });

        await admin.save();

        console.log("Admin created successfully!");
        console.log("Email: admin@crm.com");
        console.log("Password: Admin@123");
    } catch (error) {
        console.error("Failed to create admin:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();