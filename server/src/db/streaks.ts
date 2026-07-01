import { PoolClient } from 'pg';
import { getPactById } from './pacts';
import pool from './pool';

async function createStreak(client: PoolClient, pactId: string) {
  return client.query('INSERT INTO streaks (pact_id) VALUES ($1)', [pactId]);
}

async function incrementStreak(pactId: string) {
  const pact = await getPactById(pactId);
  const currentStreak = pact.current_streak + 1;
  const longestStreak = Math.max(pact.longest_streak, currentStreak);

  const text =
    'UPDATE streaks SET current_streak = $1, longest_streak = $2 WHERE id = $3 RETURNING *';
  const values = [currentStreak, longestStreak, pactId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { createStreak, incrementStreak };
