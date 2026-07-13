import { PoolClient } from 'pg';
import { getPactById } from './pacts';
import pool from './pool';

async function createStreak(client: PoolClient, pactId: string) {
  return client.query('INSERT INTO streaks (pact_id) VALUES ($1)', [pactId]);
}

async function getStreakByPactId(pactId: string) {
  const text = 'SELECT * FROM streaks WHERE pact_id = $1';
  const values = [pactId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function incrementStreak(client: PoolClient, pactId: string) {
  const text = `
  WITH new_streak AS (
  SELECT
    CASE
      WHEN last_completed_date = CURRENT_DATE THEN current_streak
      WHEN last_completed_date = CURRENT_DATE - 1 THEN current_streak + 1
      ELSE 1
    END AS value
  FROM streaks
  WHERE pact_id = $1
  )
  UPDATE streaks
  SET
    current_streak = new_streak.value,
    longest_streak = GREATEST(streaks.longest_streak, new_streak.value),
    last_completed_date = CURRENT_DATE
  FROM new_streak
  WHERE pact_id = $1
  RETURNING *`;

  const values = [pactId];

  const result = await client.query(text, values);
  return result.rows[0];
}

async function resetBrokenStreaks() {
  const text = `
  UPDATE streaks s
  SET current_streak = 0
  FROM pacts p
  WHERE p.id = s.pact_id
    AND p.status = 'active'
    AND (s.last_completed_date IS NULL OR s.last_completed_date < CURRENT_DATE - 1)
    AND s.current_streak > 0
  RETURNING s.pact_id`;

  const result = await pool.query(text);
  return result.rows.map((r) => r.pact_id);
}

export { createStreak, incrementStreak, getStreakByPactId, resetBrokenStreaks };
