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
      'INSERT INTO pact_members (pact_id, user_id, role) VALUES ($1, $2, $4), ($1, $3, $5)',
      [pact.id, creatorId, partnerId, 'creator', 'partner'],
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
  const text =
    'SELECT * FROM pact_members JOIN pacts ON pact_members.pact_id = pacts.id WHERE pact_members.user_id = $1';
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows;
}

export { createPact, getPacts };
