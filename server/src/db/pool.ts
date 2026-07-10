import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// RUN ALTER DATABASE COMMAND TO CHANGE DATABASE TIMEZONE WHEN DEPLOYING
pool.on('connect', async (client) => {
  await client.query("SET TIME ZONE 'America/New_York'");
});

export default pool;
