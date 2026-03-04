-- Valve Type Management Module - Database Migration
-- Run this script to add valve type management tables to your existing database

-- ============================================================
-- 1. Valve Types Table
-- ============================================================
CREATE TABLE IF NOT EXISTS valve_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Valve Parameters Table
-- ============================================================
CREATE TABLE IF NOT EXISTS valve_parameters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  valve_type_id INT NOT NULL,
  parameter_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (valve_type_id) REFERENCES valve_types(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. Create Indexes for Performance
-- ============================================================
CREATE INDEX idx_valve_parameters_valve_type_id 
  ON valve_parameters(valve_type_id);

-- ============================================================
-- 4. Add valve_type_id to TCDS table (for future use)
-- ============================================================
-- Uncomment this when you're ready to link TCDS records to valve types
-- ALTER TABLE tcds ADD COLUMN valve_type_id INT NULL;
-- ALTER TABLE tcds ADD FOREIGN KEY (valve_type_id) REFERENCES valve_types(id) ON DELETE RESTRICT;

-- ============================================================
-- 5. Insert Sample Valve Types (Optional)
-- ============================================================
-- Uncomment to add sample data for testing
-- INSERT INTO valve_types (name) VALUES
-- ('Gate Valve'),
-- ('Ball Valve'),
-- ('Globe Valve'),
-- ('Check Valve'),
-- ('Butterfly Valve');

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these queries to verify the tables were created successfully:
-- SELECT * FROM valve_types;
-- SELECT * FROM valve_parameters;
-- SHOW CREATE TABLE valve_types;
-- SHOW CREATE TABLE valve_parameters;
