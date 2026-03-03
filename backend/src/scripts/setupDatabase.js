const pool = require("../config/db");

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database tables...\n");
    
    // 1. Create Units Table
    console.log("Creating units table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS units (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 2. Create Users Table
    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'sales', 'quality') NOT NULL,
        unit_id INT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        current_session_token TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL
      )
    `);
    
    // 3. Create Audit Logs Table
    console.log("Creating audit_logs table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INT NULL,
        ip_address VARCHAR(45) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // 4. Create TCDS Table
    console.log("Creating tcds table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tcds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        certificate_number VARCHAR(100) NOT NULL UNIQUE,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    
    // 5. Create MTC Table
    console.log("Creating mtc table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mtc (
        id INT PRIMARY KEY AUTO_INCREMENT,
        certificate_number VARCHAR(100) NOT NULL UNIQUE,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
      )
    `);
    
    // Insert sample units
    console.log("Inserting sample units...");
    try {
      await pool.query("INSERT IGNORE INTO units (id, name) VALUES (1, 'Unit A'), (2, 'Unit B'), (3, 'Unit C'), (4, 'Unit D')");
    } catch (err) {
      console.log("Units already exist, skipping...");
    }
    
    // Create indexes
    console.log("Creating indexes...");
    try {
      await pool.query("CREATE INDEX idx_users_email ON users(email)");
    } catch (err) { /* ignore if exists */ }
    
    try {
      await pool.query("CREATE INDEX idx_users_role ON users(role)");
    } catch (err) { /* ignore if exists */ }
    
    try {
      await pool.query("CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id)");
    } catch (err) { /* ignore if exists */ }
    
    try {
      await pool.query("CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at)");
    } catch (err) { /* ignore if exists */ }
    
    try {
      await pool.query("CREATE INDEX idx_tcds_created_by ON tcds(created_by)");
    } catch (err) { /* ignore if exists */ }
    
    try {
      await pool.query("CREATE INDEX idx_mtc_created_by ON mtc(created_by)");
    } catch (err) { /* ignore if exists */ }
    
    console.log("\n✅ Database tables created successfully!");
    console.log("\nTables created:");
    console.log("  ✓ units");
    console.log("  ✓ users");
    console.log("  ✓ audit_logs");
    console.log("  ✓ tcds");
    console.log("  ✓ mtc");
    console.log("\n✅ Sample units inserted!");
    console.log("\n🎉 Database setup complete!");
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
