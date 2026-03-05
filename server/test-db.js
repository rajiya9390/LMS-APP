const pool = require('./config/db');

async function testPool() {
    try {
        console.log('Testing pool connection...');
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        console.log('Pool connection works! Result:', rows[0].result);
        process.exit(0);
    } catch (err) {
        console.error('Pool connection failed:', err);
        process.exit(1);
    }
}

testPool();
