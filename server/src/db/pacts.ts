import pool from './pool';
import { createStreak } from './streaks';

async function createPact(
  title: string,
  creatorId: string,
  partnerId: string,
  endDate: string,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const pactResult = await client.query(
      'INSERT INTO pacts (title, creator_id, partner_id, end_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, creatorId, partnerId, endDate],
    );
    const pact = pactResult.rows[0];

    await client.query(
      'INSERT INTO pact_members (pact_id, user_id, role) VALUES ($1, $2, $3)',
      [pact.id, creatorId, 'creator'],
    );
    await client.query('COMMIT');
    return pact;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function getPacts(userId: string) {
  const text = `
  SELECT 
    p.*,
    u.name AS partner_name,
    u.username AS partner_username,
    u.avatar_url AS partner_avatar_url,
    s.current_streak,
    s.longest_streak
  FROM pact_members pm
  JOIN pacts p ON pm.pact_id = p.id
  LEFT JOIN streaks s ON p.id = s.pact_id
  JOIN users u on u.id = CASE
    WHEN p.creator_id = $1 THEN p.partner_id
    ELSE p.creator_id
  END
  WHERE pm.user_id = $1`;
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows;
}

async function getPendingPacts(userId: string) {
  const text = `
  SELECT 
    p.*, 
    u.name AS partner_name,
    u.username AS partner_username,
    u.avatar_url AS partner_avatar_url
  FROM pacts p 
  JOIN users u ON u.id = p.creator_id
  WHERE partner_id = $1 and status = $2`;
  const values = [userId, 'pending'];

  const result = await pool.query(text, values);
  return result.rows;
}

async function acceptPact(pactId: string, userId: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const acceptResult = await client.query(
      'INSERT INTO pact_members (pact_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
      [pactId, userId, 'partner'],
    );
    const accept = acceptResult.rows[0];

    await client.query('UPDATE pacts SET status = $1 WHERE id = $2', [
      'active',
      pactId,
    ]);

    await createStreak(client, pactId);

    await client.query('COMMIT');
    return accept;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function rejectPact(pactId: string) {
  const text = 'DELETE FROM pacts WHERE id = $1';
  const values = [pactId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { createPact, getPacts, acceptPact, rejectPact, getPendingPacts };
