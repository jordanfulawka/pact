import pool from './pool';

async function checkIn(pactId: string, userId: string) {
  const text = 'INSERT INTO check_ins (pact_id, user_id) VALUES ($1, $2)';
  const values = [pactId, userId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getCheckInForToday(pactId: string, userId: string) {
  const text =
    'SELECT * FROM check_ins WHERE pact_id = $1 and user_id = $2 AND date = CURRENT_DATE';
  const values = [pactId, userId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getCheckInForDate(pactId: string, userId: string, date: string) {
  // DATE SHOULD BE IN YYYY-MM-DD FORMAT
  const text =
    'SELECT * FROM check_ins WHERE pact_id = $1 AND user_id = $2 AND date = $3';
  const values = [pactId, userId, date];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { checkIn, getCheckInForToday, getCheckInForDate };
