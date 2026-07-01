import { PoolClient } from 'pg';

async function createStreak(client: PoolClient, pactId: string) {
  return client.query('INSERT INTO streaks (pact_id) VALUES ($1)', [pactId]);
}

export { createStreak };
