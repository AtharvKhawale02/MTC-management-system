const pool = require('../config/db');

async function cleanDatabase() {
  console.log('Cleaning parameter tables...\n');
  
  try {
    // Delete in correct order due to foreign keys
    await pool.query('DELETE FROM valve_parameters');
    console.log('✓ Cleared valve_parameters table');
    
    await pool.query('DELETE FROM parameter_values');
    console.log('✓ Cleared parameter_values table');
    
    await pool.query('DELETE FROM parameters');
    console.log('✓ Cleared parameters table');
    
    await pool.query('DELETE FROM valve_types');
    console.log('✓ Cleared valve_types table');
    
    console.log('\n✓ All tables cleaned successfully!\n');
    
  } catch (error) {
    console.error('✗ Clean failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

cleanDatabase();
