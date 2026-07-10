import pool from './pool';
import { incrementStreak } from './streaks';

async function checkIn(pactId: string, userId: string) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const insertResult = await client.query(
      'INSERT INTO check_ins (pact_id, user_id) VALUES ($1, $2) RETURNING *',
      [pactId, userId],
    );
    const newCheckIn = insertResult.rows[0];

    const countResult = await client.query(
      `
      SELECT
        (SELECT COUNT(*) FROM pact_members WHERE pact_id = $1) AS member_count,
        (SELECT COUNT(DISTINCT user_id) FROM check_ins WHERE pact_id = $1 AND date = CURRENT_DATE) as checked_in_count,
        (SELECT end_date::date FROM pacts WHERE id = $1) AS end_date`,
      [pactId],
    );

    const { member_count, checked_in_count, end_date } = countResult.rows[0];

    if (member_count === checked_in_count) {
      await incrementStreak(client, pactId);

      const isEndDateTodayResult = await client.query(
        'SELECT CURRENT_DATE >= $1',
        [end_date],
      );

      const isEndDateToday = isEndDateTodayResult.rows[0]['?column?'];

      if (end_date && isEndDateToday) {
        await client.query(
          `UPDATE pacts SET status='completed' WHERE id = $1 and status = 'active'`,
          [pactId],
        );
      }
    }

    await client.query('COMMIT');
    return newCheckIn;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
