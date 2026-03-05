# Accessory Parameters Migration

## Overview
This migration adds comprehensive parameters specifically designed for accessories like actuators, limit switches, positioners, and other valve accessories in the MTC Management System.

## Parameters Added

### Dropdown Parameters (13 total)
1. **Actuator Type** (Mandatory)
   - Pneumatic Single Acting, Pneumatic Double Acting
   - Electric Motor Operated, Electric Multi-turn, Electric Quarter-turn
   - Hydraulic, Solenoid
   - Manual Handwheel, Manual Lever
   - Pneumatic Rack & Pinion, Scotch Yoke

2. **Operating Voltage** (Optional)
   - 12V DC, 24V DC, 48V DC
   - 110V AC, 220V AC, 230V AC, 380V AC, 415V AC, 440V AC

3. **Fail Position** (Optional)
   - Fail Close (FC), Fail Open (FO)
   - Fail Last Position (FLP)
   - Fail Safe Close, Fail Safe Open

4. **Signal Type** (Optional)
   - 4-20mA, 0-10V, Digital On/Off
   - HART, Profibus, Foundation Fieldbus
   - Modbus, DeviceNet
   - Pneumatic 3-15 PSI

5. **Power Supply** (Optional)
   - Single Phase, Three Phase
   - 24V DC, Battery Powered, Solar Powered
   - Pneumatic (Air), Hydraulic

6. **Protection Class (IP Rating)** (Optional)
   - IP54, IP65, IP66, IP67, IP68, IP69K
   - NEMA 4, NEMA 4X, NEMA 7

7. **Mounting Type** (Optional)
   - Direct Mount, ISO 5211, Namur
   - Flange Mount, Bracket Mount
   - DIN Rail, Panel Mount

8. **Switch Type** (Optional)
   - Mechanical Limit Switch, Proximity Switch
   - Inductive Switch, Magnetic Reed Switch
   - Optical Switch, NAMUR Switch
   - Explosion Proof Switch

9. **Position Feedback** (Optional)
   - Potentiometer, 4-20mA, HART
   - Digital (Open/Close), Encoder, Resolver
   - Visual Indicator Only, None

10. **Operating Medium** (Optional)
    - Compressed Air, Nitrogen
    - Hydraulic Oil, Natural Gas, Electric

11. **Control Mode** (Optional)
    - On/Off, Modulating, Proportional
    - PID Control, Two-Position, Multi-Position

12. **Communication Protocol** (Optional)
    - HART, Profibus DP/PA
    - Foundation Fieldbus
    - Modbus RTU/TCP
    - DeviceNet, EtherNet/IP
    - AS-Interface, IO-Link, None

13. **Certification** (Optional)
    - ATEX, IECEx, FM Approved
    - CSA, CE, UL Listed
    - SIL 2, SIL 3
    - NACE MR0175, API 6D
    - ISO 9001, PED

### Number Parameters (8 total)
1. **Torque Rating (Nm)** - Maximum torque output
2. **Operating Pressure (bar)** - Air/hydraulic pressure requirement
3. **Operating Time (seconds)** - Time for full stroke
4. **Thrust Rating (N)** - Linear thrust force
5. **Operating Temperature Min (°C)** - Minimum temperature
6. **Operating Temperature Max (°C)** - Maximum temperature
7. **Current Consumption (A)** - Current at rated voltage
8. **Weight (kg)** - Weight of the accessory

### Text Parameters (5 total)
1. **Model Number** - Manufacturer model/part number
2. **Accessory Manufacturer** - Manufacturer name
3. **Serial Number** - Unique serial number
4. **Compliance Standards** - Applicable compliance standards
5. **Special Features** - Additional features or specifications

### Date Parameters (3 total)
1. **Manufacture Date** - Date of manufacture
2. **Calibration Date** - Date of last calibration
3. **Warranty Expiry** - Warranty expiration date

## How to Run the Migration

### Method 1: Using npm script (Recommended)
```bash
cd backend
npm run migrate:accessory-params
```

### Method 2: Direct execution
```bash
cd backend
node src/scripts/runAccessoryParametersMigration.js
```

## What Happens When You Run This Migration

1. **Inserts 29 new parameters** into the `parameters` table
2. **Inserts 170+ parameter values** for dropdown parameters
3. **Skips duplicates** if parameters already exist
4. **Shows a summary** of all parameters and values added

## After Migration

Once the migration is complete, you can:

1. Navigate to **Admin → Accessories Configuration → Accessories**
2. Click **"Edit"** on any accessory to manage its parameters
3. **Link relevant parameters** from the available list
4. Use these parameters when creating TCDS records

## Example Usage

### For an Actuator Accessory:
- Actuator Type: Pneumatic Double Acting
- Operating Pressure (bar): 6
- Fail Position: Fail Close (FC)
- Torque Rating (Nm): 120
- Protection Class (IP Rating): IP67
- Mounting Type: ISO 5211

### For a Limit Switch Accessory:
- Switch Type: Proximity Switch
- Operating Voltage: 24V DC
- Protection Class (IP Rating): IP65
- Signal Type: 4-20mA
- Mounting Type: Namur

### For a Positioner Accessory:
- Signal Type: 4-20mA
- Communication Protocol: HART
- Power Supply: 24V DC
- Position Feedback: 4-20mA
- Control Mode: Proportional

## Notes

- All accessory parameters are **independent** from valve parameters
- Parameters can be **shared across multiple accessories**
- The same parameters list is used for both valves and accessories
- You can add custom parameter values through the UI after migration
- Parameters marked as "Mandatory" should be configured for each accessory type

## Database Tables Affected

- `parameters` - Adds 29 new parameter definitions
- `parameter_values` - Adds 170+ dropdown values
- `accessory_parameters` - Link table (created in accessories_migration.sql)

## Rollback

To remove accessory parameters (if needed):
```sql
DELETE FROM parameters WHERE name IN (
  'Actuator Type', 'Operating Voltage', 'Fail Position', ...
);
```
Note: This will cascade delete all related parameter values and links.
