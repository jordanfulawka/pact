import pg from 'pg';
const { Pool, types } = pg;

// Return DATE columns as plain 'YYYY-MM-DD' strings instead of node-postgres's
// default UTC-midnight Date object, which shifts a day when re-parsed client-side.
types.setTypeParser(types.builtins.DATE, (val: string) => val);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// RUN ALTER DATABASE COMMAND TO CHANGE DATABASE TIMEZONE WHEN DEPLOYING
pool.on('connect', async (client) => {
  await client.query("SET TIME ZONE 'America/New_York'");
});

export default pool;
