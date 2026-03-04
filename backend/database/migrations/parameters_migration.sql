-- Parameters Migration SQL
-- This migration creates tables for managing parameters and their dropdown values

-- 1. Create parameters table (master list of all parameters)
CREATE TABLE IF NOT EXISTS parameters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  type ENUM('text', 'dropdown', 'number', 'date') NOT NULL DEFAULT 'text',
  is_mandatory BOOLEAN DEFAULT FALSE,
  validation_rule VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create parameter_values table (for dropdown values)
CREATE TABLE IF NOT EXISTS parameter_values (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parameter_id INT NOT NULL,
  value VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parameter_id) REFERENCES parameters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_parameter_value (parameter_id, value)
);

-- 3. Update valve_parameters table to reference parameters table
-- First, rename the old table if it exists
DROP TABLE IF EXISTS valve_parameters_old;
RENAME TABLE valve_parameters TO valve_parameters_old;

-- Create new valve_parameters table with proper references
CREATE TABLE IF NOT EXISTS valve_parameters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  valve_type_id INT NOT NULL,
  parameter_id INT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (valve_type_id) REFERENCES valve_types(id) ON DELETE CASCADE,
  FOREIGN KEY (parameter_id) REFERENCES parameters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_valve_parameter (valve_type_id, parameter_id)
);

-- Create indexes for better performance
CREATE INDEX idx_parameter_values_parameter_id ON parameter_values(parameter_id);
CREATE INDEX idx_valve_parameters_valve_type_id ON valve_parameters(valve_type_id);
CREATE INDEX idx_valve_parameters_parameter_id ON valve_parameters(parameter_id);

-- Insert sample parameters (Comprehensive dummy data)
INSERT INTO parameters (name, type, is_mandatory, validation_rule) VALUES
-- Dropdown type parameters
('Material Grade', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Pressure Rating', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Size', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('End Connection', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Body Material', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Seat Material', 'dropdown', FALSE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Stem Material', 'dropdown', FALSE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Design Standard', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Face to Face/End to End', 'dropdown', FALSE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Testing Standard', 'dropdown', TRUE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Temperature Rating', 'dropdown', FALSE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),
('Bonnet Type', 'dropdown', FALSE, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'),

-- Text type parameters
('Serial Number', 'text', TRUE, 'Max 100 characters. Alphanumeric only.'),
('Heat Number', 'text', FALSE, 'Max 100 characters. Material traceability reference.'),
('Manufacturer', 'text', FALSE, 'Max 200 characters. Valve manufacturer name.'),
('Special Requirements', 'text', FALSE, 'Max 500 characters. Additional specifications or notes.'),

-- Number type parameters
('Shell Test Pressure (bar)', 'number', TRUE, 'Must be positive number. Typical range: 1-500.'),
('Seat Test Pressure (bar)', 'number', TRUE, 'Must be positive number. Typical range: 1-500.'),
('Working Pressure (bar)', 'number', TRUE, 'Must be positive number. Maximum operating pressure.'),
('Weight (kg)', 'number', FALSE, 'Must be positive number. Approximate valve weight.'),

-- Date type parameters
('Manufacturing Date', 'date', FALSE, 'Date format: YYYY-MM-DD.'),
('Testing Date', 'date', TRUE, 'Date format: YYYY-MM-DD. Date when valve was tested.');

-- Insert comprehensive parameter values for dropdown parameters
INSERT INTO parameter_values (parameter_id, value) VALUES
-- Material Grade (parameter_id: 1)
(1, 'ASTM A216 Gr.WCB'),
(1, 'ASTM A216 Gr.WCC'),
(1, 'ASTM A217 Gr.WC6'),
(1, 'ASTM A217 Gr.WC9'),
(1, 'ASTM A351 Gr.CF8'),
(1, 'ASTM A351 Gr.CF8M'),
(1, 'ASTM A351 Gr.CF3'),
(1, 'ASTM A351 Gr.CF3M'),
(1, 'ASTM A182 Gr.F304'),
(1, 'ASTM A182 Gr.F316'),
(1, 'ASTM A105'),
(1, 'ASTM A350 LF2'),

-- Pressure Rating (parameter_id: 2)
(2, 'Class 150'),
(2, 'Class 300'),
(2, 'Class 600'),
(2, 'Class 800'),
(2, 'Class 900'),
(2, 'Class 1500'),
(2, 'Class 2500'),
(2, 'PN 10'),
(2, 'PN 16'),
(2, 'PN 25'),
(2, 'PN 40'),
(2, 'PN 63'),
(2, 'PN 100'),

-- Size (parameter_id: 3)
(3, '1/4"'),
(3, '3/8"'),
(3, '1/2"'),
(3, '3/4"'),
(3, '1"'),
(3, '1-1/4"'),
(3, '1-1/2"'),
(3, '2"'),
(3, '2-1/2"'),
(3, '3"'),
(3, '4"'),
(3, '6"'),
(3, '8"'),
(3, '10"'),
(3, '12"'),
(3, 'DN15'),
(3, 'DN20'),
(3, 'DN25'),
(3, 'DN40'),
(3, 'DN50'),
(3, 'DN80'),
(3, 'DN100'),
(3, 'DN150'),

-- End Connection (parameter_id: 4)
(4, 'Flanged RF'),
(4, 'Flanged RTJ'),
(4, 'Threaded NPT'),
(4, 'Threaded BSP'),
(4, 'Socket Weld'),
(4, 'Butt Weld'),
(4, 'Wafer'),
(4, 'Lug'),

-- Body Material (parameter_id: 5)
(5, 'Carbon Steel'),
(5, 'Stainless Steel 304'),
(5, 'Stainless Steel 316'),
(5, 'Stainless Steel 316L'),
(5, 'Cast Iron'),
(5, 'Ductile Iron'),
(5, 'Bronze'),
(5, 'Brass'),
(5, 'Alloy Steel'),
(5, 'Duplex Stainless Steel'),
(5, 'Super Duplex'),

-- Seat Material (parameter_id: 6)
(6, 'PTFE'),
(6, 'Metal Seated'),
(6, 'Stellite'),
(6, 'Stainless Steel 304'),
(6, 'Stainless Steel 316'),
(6, 'RPTFE'),
(6, 'Graphite'),
(6, 'PEEK'),
(6, 'Viton'),
(6, 'NBR'),

-- Stem Material (parameter_id: 7)
(7, 'Stainless Steel 304'),
(7, 'Stainless Steel 316'),
(7, 'Stainless Steel 410'),
(7, 'Stainless Steel 416'),
(7, 'Stainless Steel 17-4 PH'),
(7, 'Duplex Stainless Steel'),
(7, 'Monel'),

-- Design Standard (parameter_id: 8)
(8, 'API 6D'),
(8, 'API 600'),
(8, 'API 602'),
(8, 'ASME B16.34'),
(8, 'BS 1873'),
(8, 'BS 5351'),
(8, 'ISO 10497'),
(8, 'DIN 3352'),
(8, 'EN 593'),

-- Face to Face/End to End (parameter_id: 9)
(9, 'ASME B16.10'),
(9, 'API 6D'),
(9, 'DIN 3202'),
(9, 'ISO 5752'),
(9, 'EN 558-1 Series 1'),
(9, 'EN 558-1 Series 14'),

-- Testing Standard (parameter_id: 10)
(10, 'API 598'),
(10, 'API 6D'),
(10, 'ISO 5208'),
(10, 'BS EN 12266'),
(10, 'MSS SP-61'),
(10, 'ASME B16.34'),

-- Temperature Rating (parameter_id: 11)
(11, '-29°C to 425°C'),
(11, '-46°C to 400°C'),
(11, '-29°C to 538°C'),
(11, '-196°C to 100°C (Cryogenic)'),
(11, '-60°C to 450°C'),
(11, 'Ambient Temperature Only'),

-- Bonnet Type (parameter_id: 12)
(12, 'Bolted Bonnet'),
(12, 'Welded Bonnet'),
(12, 'Pressure Seal Bonnet'),
(12, 'Union Bonnet'),
(12, 'Screwed Bonnet'),
(12, 'Extended Bonnet');

-- Insert sample valve types (if not already present)
INSERT IGNORE INTO valve_types (name) VALUES
('Gate Valve'),
('Ball Valve'),
('Globe Valve'),
('Check Valve'),
('Butterfly Valve'),
('Plug Valve'),
('Needle Valve'),
('Diaphragm Valve'),
('Pressure Relief Valve'),
('Control Valve');

-- Link parameters to valve types (sample associations)
-- Gate Valve (id: 1) - Full parameter set
INSERT IGNORE INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES
(1, 1, 1),   -- Material Grade
(1, 2, 2),   -- Pressure Rating
(1, 3, 3),   -- Size
(1, 4, 4),   -- End Connection
(1, 5, 5),   -- Body Material
(1, 6, 6),   -- Seat Material
(1, 7, 7),   -- Stem Material
(1, 8, 8),   -- Design Standard
(1, 9, 9),   -- Face to Face
(1, 10, 10), -- Testing Standard
(1, 11, 11), -- Temperature Rating
(1, 12, 12), -- Bonnet Type
(1, 13, 13), -- Serial Number
(1, 14, 14), -- Heat Number
(1, 17, 15), -- Shell Test Pressure
(1, 18, 16), -- Seat Test Pressure
(1, 19, 17), -- Working Pressure
(1, 22, 18); -- Testing Date

-- Ball Valve (id: 2) - Common parameters
INSERT IGNORE INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES
(2, 1, 1),   -- Material Grade
(2, 2, 2),   -- Pressure Rating
(2, 3, 3),   -- Size
(2, 4, 4),   -- End Connection
(2, 5, 5),   -- Body Material
(2, 6, 6),   -- Seat Material
(2, 8, 7),   -- Design Standard
(2, 10, 8),  -- Testing Standard
(2, 13, 9),  -- Serial Number
(2, 17, 10), -- Shell Test Pressure
(2, 18, 11), -- Seat Test Pressure
(2, 22, 12); -- Testing Date

-- Globe Valve (id: 3)
INSERT IGNORE INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES
(3, 1, 1),   -- Material Grade
(3, 2, 2),   -- Pressure Rating
(3, 3, 3),   -- Size
(3, 4, 4),   -- End Connection
(3, 5, 5),   -- Body Material
(3, 6, 6),   -- Seat Material
(3, 7, 7),   -- Stem Material
(3, 8, 8),   -- Design Standard
(3, 10, 9),  -- Testing Standard
(3, 12, 10), -- Bonnet Type
(3, 13, 11), -- Serial Number
(3, 17, 12), -- Shell Test Pressure
(3, 18, 13), -- Seat Test Pressure
(3, 22, 14); -- Testing Date

-- Check Valve (id: 4)
INSERT IGNORE INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES
(4, 1, 1),   -- Material Grade
(4, 2, 2),   -- Pressure Rating
(4, 3, 3),   -- Size
(4, 4, 4),   -- End Connection
(4, 5, 5),   -- Body Material
(4, 8, 6),   -- Design Standard
(4, 10, 7),  -- Testing Standard
(4, 13, 8),  -- Serial Number
(4, 17, 9),  -- Shell Test Pressure
(4, 22, 10); -- Testing Date

-- Butterfly Valve (id: 5)
INSERT IGNORE INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES
(5, 1, 1),   -- Material Grade
(5, 2, 2),   -- Pressure Rating
(5, 3, 3),   -- Size
(5, 4, 4),   -- End Connection
(5, 5, 5),   -- Body Material
(5, 6, 6),   -- Seat Material
(5, 8, 7),   -- Design Standard
(5, 9, 8),   -- Face to Face
(5, 10, 9),  -- Testing Standard
(5, 13, 10), -- Serial Number
(5, 17, 11), -- Shell Test Pressure
(5, 18, 12), -- Seat Test Pressure
(5, 22, 13); -- Testing Date
