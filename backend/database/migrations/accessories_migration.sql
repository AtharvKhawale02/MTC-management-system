-- Accessories Table Migration
-- Create table for managing accessories in the MTC Management System

CREATE TABLE IF NOT EXISTS accessories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for linking accessories to parameters
CREATE TABLE IF NOT EXISTS accessory_parameters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accessory_id INT NOT NULL,
  parameter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (accessory_id) REFERENCES accessories(id) ON DELETE CASCADE,
  FOREIGN KEY (parameter_id) REFERENCES parameters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_accessory_parameter (accessory_id, parameter_id)
);

-- Create indexes for better performance
CREATE INDEX idx_accessory_parameters_accessory_id ON accessory_parameters(accessory_id);
CREATE INDEX idx_accessory_parameters_parameter_id ON accessory_parameters(parameter_id);

-- Insert sample accessories
INSERT IGNORE INTO accessories (name) VALUES
('Actuator'),
('Limit Switch'),
('Positioner');
