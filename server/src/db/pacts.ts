import pool from './pool';

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
    u.avatar_url AS partner_avatar_url
  FROM pact_members pm
  JOIN pacts p ON pm.pact_id = p.id
  JOIN users u on u.id = CASE
    WHEN p.creator_id = $1 THEN p.partner_id
    ELSE p.creator_id
  END
  WHERE pm.user_id = $1`;
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows;
}

export { createPact, getPacts };
