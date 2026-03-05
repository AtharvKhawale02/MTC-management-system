-- Accessory Parameters Migration SQL
-- This migration adds parameters specific to accessories like actuators, limit switches, positioners, etc.

-- Insert accessory-specific parameters
INSERT INTO parameters (name, type, is_mandatory, validation_rule) VALUES
-- Dropdown type parameters for accessories
('Actuator Type', 'dropdown', TRUE, 'Select the type of actuator mechanism'),
('Operating Voltage', 'dropdown', FALSE, 'Electrical voltage requirement for the accessory'),
('Fail Position', 'dropdown', FALSE, 'Position the valve takes on power/air failure'),
('Signal Type', 'dropdown', FALSE, 'Control signal type for the accessory'),
('Power Supply', 'dropdown', FALSE, 'Power supply specification for electrical accessories'),
('Protection Class (IP Rating)', 'dropdown', FALSE, 'Ingress Protection rating for environmental protection'),
('Mounting Type', 'dropdown', FALSE, 'Method of mounting the accessory'),
('Switch Type', 'dropdown', FALSE, 'Type of switch mechanism (for limit switches)'),
('Position Feedback', 'dropdown', FALSE, 'Type of position feedback provided'),
('Operating Medium', 'dropdown', FALSE, 'Medium used for operation (air, hydraulic, etc.)'),
('Control Mode', 'dropdown', FALSE, 'Mode of control operation'),
('Communication Protocol', 'dropdown', FALSE, 'Communication protocol for smart accessories'),
('Certification', 'dropdown', FALSE, 'Safety and quality certifications'),

-- Number type parameters for accessories
('Torque Rating (Nm)', 'number', FALSE, 'Maximum torque output of the actuator in Newton-meters'),
('Operating Pressure (bar)', 'number', FALSE, 'Operating air/hydraulic pressure requirement'),
('Operating Time (seconds)', 'number', FALSE, 'Time taken for full stroke operation'),
('Thrust Rating (N)', 'number', FALSE, 'Linear thrust force for linear actuators'),
('Operating Temperature Min (°C)', 'number', FALSE, 'Minimum operating temperature'),
('Operating Temperature Max (°C)', 'number', FALSE, 'Maximum operating temperature'),
('Current Consumption (A)', 'number', FALSE, 'Current consumption at rated voltage'),
('Weight (kg)', 'number', FALSE, 'Weight of the accessory'),

-- Text type parameters for accessories
('Model Number', 'text', FALSE, 'Manufacturer model/part number'),
('Accessory Manufacturer', 'text', FALSE, 'Manufacturer name of the accessory'),
('Serial Number', 'text', FALSE, 'Unique serial number of the accessory'),
('Compliance Standards', 'text', FALSE, 'Applicable compliance standards'),
('Special Features', 'text', FALSE, 'Additional features or specifications'),

-- Date type parameters for accessories
('Manufacture Date', 'date', FALSE, 'Date of manufacture'),
('Calibration Date', 'date', FALSE, 'Date of last calibration'),
('Warranty Expiry', 'date', FALSE, 'Warranty expiration date');

-- Insert parameter values for dropdown parameters
-- Get the parameter IDs dynamically (these will be inserted after the valve parameters)

-- Actuator Type values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Pneumatic Single Acting' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Pneumatic Double Acting' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Electric Motor Operated' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Electric Multi-turn' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Electric Quarter-turn' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Hydraulic' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Solenoid' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Manual Handwheel' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Manual Lever' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Pneumatic Rack & Pinion' FROM parameters WHERE name = 'Actuator Type'
UNION ALL SELECT id, 'Scotch Yoke' FROM parameters WHERE name = 'Actuator Type';

-- Operating Voltage values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, '24V DC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '48V DC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '110V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '220V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '230V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '380V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '415V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '440V AC' FROM parameters WHERE name = 'Operating Voltage'
UNION ALL SELECT id, '12V DC' FROM parameters WHERE name = 'Operating Voltage';

-- Fail Position values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Fail Close (FC)' FROM parameters WHERE name = 'Fail Position'
UNION ALL SELECT id, 'Fail Open (FO)' FROM parameters WHERE name = 'Fail Position'
UNION ALL SELECT id, 'Fail Last Position (FLP)' FROM parameters WHERE name = 'Fail Position'
UNION ALL SELECT id, 'Fail Safe Close' FROM parameters WHERE name = 'Fail Position'
UNION ALL SELECT id, 'Fail Safe Open' FROM parameters WHERE name = 'Fail Position';

-- Signal Type values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, '4-20mA' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, '0-10V' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'Digital On/Off' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'HART' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'Profibus' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'Foundation Fieldbus' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'Modbus' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'DeviceNet' FROM parameters WHERE name = 'Signal Type'
UNION ALL SELECT id, 'Pneumatic 3-15 PSI' FROM parameters WHERE name = 'Signal Type';

-- Power Supply values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Single Phase' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, 'Three Phase' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, '24V DC' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, 'Battery Powered' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, 'Solar Powered' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, 'Pneumatic (Air)' FROM parameters WHERE name = 'Power Supply'
UNION ALL SELECT id, 'Hydraulic' FROM parameters WHERE name = 'Power Supply';

-- Protection Class (IP Rating) values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'IP54' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'IP65' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'IP66' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'IP67' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'IP68' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'IP69K' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'NEMA 4' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'NEMA 4X' FROM parameters WHERE name = 'Protection Class (IP Rating)'
UNION ALL SELECT id, 'NEMA 7' FROM parameters WHERE name = 'Protection Class (IP Rating)';

-- Mounting Type values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Direct Mount' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'ISO 5211' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'Namur' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'Flange Mount' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'Bracket Mount' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'DIN Rail' FROM parameters WHERE name = 'Mounting Type'
UNION ALL SELECT id, 'Panel Mount' FROM parameters WHERE name = 'Mounting Type';

-- Switch Type values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Mechanical Limit Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'Proximity Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'Inductive Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'Magnetic Reed Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'Optical Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'NAMUR Switch' FROM parameters WHERE name = 'Switch Type'
UNION ALL SELECT id, 'Explosion Proof Switch' FROM parameters WHERE name = 'Switch Type';

-- Position Feedback values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Potentiometer' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, '4-20mA' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'HART' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'Digital (Open/Close)' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'Encoder' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'Resolver' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'Visual Indicator Only' FROM parameters WHERE name = 'Position Feedback'
UNION ALL SELECT id, 'None' FROM parameters WHERE name = 'Position Feedback';

-- Operating Medium values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'Compressed Air' FROM parameters WHERE name = 'Operating Medium'
UNION ALL SELECT id, 'Nitrogen' FROM parameters WHERE name = 'Operating Medium'
UNION ALL SELECT id, 'Hydraulic Oil' FROM parameters WHERE name = 'Operating Medium'
UNION ALL SELECT id, 'Natural Gas' FROM parameters WHERE name = 'Operating Medium'
UNION ALL SELECT id, 'Electric' FROM parameters WHERE name = 'Operating Medium';

-- Control Mode values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'On/Off' FROM parameters WHERE name = 'Control Mode'
UNION ALL SELECT id, 'Modulating' FROM parameters WHERE name = 'Control Mode'
UNION ALL SELECT id, 'Proportional' FROM parameters WHERE name = 'Control Mode'
UNION ALL SELECT id, 'PID Control' FROM parameters WHERE name = 'Control Mode'
UNION ALL SELECT id, 'Two-Position' FROM parameters WHERE name = 'Control Mode'
UNION ALL SELECT id, 'Multi-Position' FROM parameters WHERE name = 'Control Mode';

-- Communication Protocol values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'HART' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'Profibus DP' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'Profibus PA' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'Foundation Fieldbus' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'Modbus RTU' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'Modbus TCP' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'DeviceNet' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'EtherNet/IP' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'AS-Interface' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'IO-Link' FROM parameters WHERE name = 'Communication Protocol'
UNION ALL SELECT id, 'None' FROM parameters WHERE name = 'Communication Protocol';

-- Certification values
INSERT INTO parameter_values (parameter_id, value) 
SELECT id, 'ATEX' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'IECEx' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'FM Approved' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'CSA' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'CE' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'UL Listed' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'SIL 2' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'SIL 3' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'NACE MR0175' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'API 6D' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'ISO 9001' FROM parameters WHERE name = 'Certification'
UNION ALL SELECT id, 'PED' FROM parameters WHERE name = 'Certification';
