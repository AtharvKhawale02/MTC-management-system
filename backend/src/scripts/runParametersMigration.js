const pool = require('../config/db');

async function runMigration() {
  console.log('Starting parameters migration...\n');
  
  try {
    // Step 1: Clean up old table if exists
    console.log('Step 1: Handling old valve_parameters table...');
    try {
      await pool.query('DROP TABLE IF EXISTS valve_parameters_old');
      await pool.query('DROP TABLE IF EXISTS valve_parameters');
      console.log('✓ Cleaned up old tables\n');
    } catch (error) {
      console.log('⚠ No old tables to clean up\n');
    }

    // Reset auto-increment counters
    try {
      await pool.query('ALTER TABLE parameters AUTO_INCREMENT = 1');
      await pool.query('ALTER TABLE parameter_values AUTO_INCREMENT = 1');
      await pool.query('ALTER TABLE valve_types AUTO_INCREMENT = 1');
      console.log('✓ Reset auto-increment counters\n');
    } catch (error) {
      console.log('⚠ Could not reset auto-increment\n');
    }

    // Step 2: Create parameters table
    console.log('Step 2: Creating parameters table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parameters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        type ENUM('text', 'dropdown', 'number', 'date') NOT NULL DEFAULT 'text',
        is_mandatory BOOLEAN DEFAULT FALSE,
        validation_rule VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created parameters table\n');

    // Step 3: Create parameter_values table
    console.log('Step 3: Creating parameter_values table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS parameter_values (
        id INT PRIMARY KEY AUTO_INCREMENT,
        parameter_id INT NOT NULL,
        value VARCHAR(200) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parameter_id) REFERENCES parameters(id) ON DELETE CASCADE,
        UNIQUE KEY unique_parameter_value (parameter_id, value)
      )
    `);
    console.log('✓ Created parameter_values table\n');

    // Step 4: Create new valve_parameters table
    console.log('Step 4: Creating valve_parameters table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS valve_parameters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        valve_type_id INT NOT NULL,
        parameter_id INT NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (valve_type_id) REFERENCES valve_types(id) ON DELETE CASCADE,
        FOREIGN KEY (parameter_id) REFERENCES parameters(id) ON DELETE CASCADE,
        UNIQUE KEY unique_valve_parameter (valve_type_id, parameter_id)
      )
    `);
    console.log('✓ Created valve_parameters table\n');

    // Step 5: Create indexes
    console.log('Step 5: Creating indexes...');
    try {
      await pool.query('CREATE INDEX idx_parameter_values_parameter_id ON parameter_values(parameter_id)');
      await pool.query('CREATE INDEX idx_valve_parameters_valve_type_id ON valve_parameters(valve_type_id)');
      await pool.query('CREATE INDEX idx_valve_parameters_parameter_id ON valve_parameters(parameter_id)');
      console.log('✓ Created indexes\n');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠ Indexes already exist\n');
      } else {
        throw error;
      }
    }

    // Step 6: Insert parameters
    console.log('Step 6: Inserting parameters...');
    const parametersData = [
      ['Material Grade', 'dropdown', true, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'],
      ['Pressure Rating', 'dropdown', true, 'Max 200 characters. Must be unique within this parameter (case-insensitive).'],
      ['Size', 'dropdown', true, 'Max 200 characters. Must be unique within this parameter (case-insensitive).']
    ];

    for (const param of parametersData) {
      try {
        await pool.query(
          'INSERT INTO parameters (name, type, is_mandatory, validation_rule) VALUES (?, ?, ?, ?)',
          param
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log(`✓ Inserted ${parametersData.length} parameters\n`);

    // Step 7: Insert parameter values
    console.log('Step 7: Inserting parameter values (this may take a moment)...');
    const parameterValues = [
      // Material Grade (id: 1)
      [1, 'ASTM A216 Gr.WCB'],
      [1, 'ASTM A216 Gr.WCC'],
      [1, 'ASTM A217 Gr.WC6'],
      [1, 'ASTM A217 Gr.WC9'],
      [1, 'ASTM A351 Gr.CF8'],
      [1, 'ASTM A351 Gr.CF8M'],
      [1, 'ASTM A351 Gr.CF3'],
      [1, 'ASTM A351 Gr.CF3M'],
      [1, 'ASTM A182 Gr.F304'],
      [1, 'ASTM A182 Gr.F316'],
      [1, 'ASTM A105'],
      [1, 'ASTM A350 LF2'],
      // Pressure Rating (id: 2)
      [2, 'Class 150'],
      [2, 'Class 300'],
      [2, 'Class 600'],
      [2, 'Class 800'],
      [2, 'Class 900'],
      [2, 'Class 1500'],
      [2, 'Class 2500'],
      [2, 'PN 10'],
      [2, 'PN 16'],
      [2, 'PN 25'],
      [2, 'PN 40'],
      [2, 'PN 63'],
      [2, 'PN 100'],
      // Size (id: 3)
      [3, '1/4"'],
      [3, '3/8"'],
      [3, '1/2"'],
      [3, '3/4"'],
      [3, '1"'],
      [3, '1-1/4"'],
      [3, '1-1/2"'],
      [3, '2"'],
      [3, '2-1/2"'],
      [3, '3"'],
      [3, '4"'],
      [3, '6"'],
      [3, '8"'],
      [3, '10"'],
      [3, '12"'],
      [3, 'DN15'],
      [3, 'DN20'],
      [3, 'DN25'],
      [3, 'DN40'],
      [3, 'DN50'],
      [3, 'DN80'],
      [3, 'DN100'],
      [3, 'DN150']
    ];

    for (const value of parameterValues) {
      try {
        await pool.query(
          'INSERT INTO parameter_values (parameter_id, value) VALUES (?, ?)',
          value
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log(`✓ Inserted ${parameterValues.length} parameter values\n`);

    // Step 8: Insert valve types
    console.log('Step 8: Inserting valve types...');
    const valveTypesData = [
      'Gate Valve',
      'Ball Valve',
      'Globe Valve'
    ];

    for (const valveType of valveTypesData) {
      try {
        await pool.query('INSERT INTO valve_types (name) VALUES (?)', [valveType]);
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log(`✓ Inserted ${valveTypesData.length} valve types\n`);

    // Step 9: Get actual valve type IDs
    console.log('Step 9: Getting valve type IDs...');
    const [valveTypesFromDB] = await pool.query('SELECT id, name FROM valve_types ORDER BY id');
    const valveTypeMap = {};
    valveTypesFromDB.forEach(vt => {
      valveTypeMap[vt.name] = vt.id;
    });
    console.log('✓ Retrieved valve type IDs\n');

    // Step 10: Link parameters to valve types
    console.log('Step 10: Linking parameters to valve types...');
    
    // Get valve type IDs
    const gateValveId = valveTypeMap['Gate Valve'];
    const ballValveId = valveTypeMap['Ball Valve'];
    const globeValveId = valveTypeMap['Globe Valve'];
    
    const valveParameterLinks = [];
    
    // Gate Valve - 3 parameters
    if (gateValveId) {
      valveParameterLinks.push(
        [gateValveId, 1, 1], // Material Grade
        [gateValveId, 2, 2], // Pressure Rating
        [gateValveId, 3, 3]  // Size
      );
    }
    
    // Ball Valve - 3 parameters
    if (ballValveId) {
      valveParameterLinks.push(
        [ballValveId, 1, 1], // Material Grade
        [ballValveId, 2, 2], // Pressure Rating
        [ballValveId, 3, 3]  // Size
      );
    }
    
    // Globe Valve - 3 parameters
    if (globeValveId) {
      valveParameterLinks.push(
        [globeValveId, 1, 1], // Material Grade
        [globeValveId, 2, 2], // Pressure Rating
        [globeValveId, 3, 3]  // Size
      );
    }

    for (const link of valveParameterLinks) {
      try {
        await pool.query(
          'INSERT INTO valve_parameters (valve_type_id, parameter_id, display_order) VALUES (?, ?, ?)',
          link
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log(`✓ Created ${valveParameterLinks.length} valve-parameter links\n`);
    
    console.log('\n✓ Migration completed successfully!\n');
    
    // Verify the data
    console.log('Verifying imported data...');
    const [paramRows] = await pool.query('SELECT COUNT(*) as count FROM parameters');
    console.log(`  - Parameters: ${paramRows[0].count}`);
    
    const [valueRows] = await pool.query('SELECT COUNT(*) as count FROM parameter_values');
    console.log(`  - Parameter Values: ${valueRows[0].count}`);
    
    const [typeRows] = await pool.query('SELECT COUNT(*) as count FROM valve_types');
    console.log(`  - Valve Types: ${typeRows[0].count}`);
    
    const [linkRows] = await pool.query('SELECT COUNT(*) as count FROM valve_parameters');
    console.log(`  - Valve-Parameter Links: ${linkRows[0].count}`);
    
    console.log('\n✓ All done! You can now use the parameters feature.\n');
    
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

runMigration();
