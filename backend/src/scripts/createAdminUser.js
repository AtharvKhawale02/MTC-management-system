const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function createAdminUser() {
  try {
    console.log("Connecting to database...");
    
    // Check if admin user already exists
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      ["admin@gmail.com"]
    );
    
    if (existing.length > 0) {
      console.log("❌ Admin user already exists!");
      console.log("Email: admin@gmail.com");
      process.exit(0);
    }
    
    // Hash the password
    const password = "Admin@123";
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert admin user
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, unit_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ["Admin User", "admin@gmail.com", passwordHash, "admin", null, true]
    );
    
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");
    console.log("\n⚠️  Please change the password after first login!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

createAdminUser();
