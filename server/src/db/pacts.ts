import pool from './pool';

async function createPact(
  title: string,
  creatorId: string,
  partnerId: string,
  endDate: string,
) {
  const text =
    'INSERT INTO pacts (title, creator_id, partner_id, end_date) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [title, creatorId, partnerId, endDate];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { createPact };
