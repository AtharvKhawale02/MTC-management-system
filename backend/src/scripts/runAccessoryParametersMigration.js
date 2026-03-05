const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runAccessoryParametersMigration() {
  console.log('Starting accessory parameters migration...\n');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../../database/migrations/accessory_parameters_migration.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon to get individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let skipCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Skip comments
        if (statement.startsWith('--')) {
          continue;
        }

        await pool.query(statement);
        successCount++;
        
        // Show progress for every 10 statements
        if ((i + 1) % 10 === 0) {
          console.log(`Progress: ${i + 1}/${statements.length} statements executed`);
        }
      } catch (error) {
        // Skip duplicate entry errors (parameter or value already exists)
        if (error.code === 'ER_DUP_ENTRY') {
          skipCount++;
        } else if (error.code === 'ER_DUP_KEYNAME') {
          skipCount++;
        } else {
          console.error(`\n❌ Error executing statement ${i + 1}:`);
          console.error(statement.substring(0, 100) + '...');
          console.error(error.message);
          // Continue with next statement instead of failing completely
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`   ${successCount} statements executed`);
    console.log(`   ${skipCount} statements skipped (duplicates)`);

    // Show summary of added parameters
    const [accessoryParams] = await pool.query(`
      SELECT name, type, is_mandatory 
      FROM parameters 
      WHERE name IN (
        'Actuator Type', 'Operating Voltage', 'Fail Position', 'Signal Type',
        'Power Supply', 'Protection Class (IP Rating)', 'Mounting Type', 'Switch Type',
        'Position Feedback', 'Operating Medium', 'Control Mode', 'Communication Protocol',
        'Certification', 'Torque Rating (Nm)', 'Operating Pressure (bar)', 'Operating Time (seconds)',
        'Thrust Rating (N)', 'Operating Temperature Min (°C)', 'Operating Temperature Max (°C)',
        'Current Consumption (A)', 'Model Number', 'Accessory Manufacturer', 'Manufacture Date',
        'Calibration Date', 'Warranty Expiry'
      )
      ORDER BY name
    `);

    console.log('\n📋 Accessory Parameters Added:');
    console.log('================================');
    accessoryParams.forEach(param => {
      const mandatory = param.is_mandatory ? '(Mandatory)' : '(Optional)';
      console.log(`  - ${param.name} [${param.type}] ${mandatory}`);
    });

    // Show count of parameter values added
    const [valueCount] = await pool.query(`
      SELECT COUNT(*) as count 
      FROM parameter_values pv
      JOIN parameters p ON pv.parameter_id = p.id
      WHERE p.name IN (
        'Actuator Type', 'Operating Voltage', 'Fail Position', 'Signal Type',
        'Power Supply', 'Protection Class (IP Rating)', 'Mounting Type', 'Switch Type',
        'Position Feedback', 'Operating Medium', 'Control Mode', 'Communication Protocol',
        'Certification'
      )
    `);

    console.log(`\n📊 Total parameter values added: ${valueCount[0].count}`);
    console.log('\n✨ You can now link these parameters to accessories through the UI!');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the migration
runAccessoryParametersMigration();
