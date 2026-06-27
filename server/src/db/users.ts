import pool from './pool';

async function createUser(
  email: string,
  username: string,
  password_hash: string,
) {
  const text =
    'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *';
  const values = [email, username, password_hash];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserByEmail(email: string) {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { createUser, getUserByEmail };
