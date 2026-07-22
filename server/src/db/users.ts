import pool from './pool';

async function createUser(
  name: string,
  username: string,
  email: string,
  password_hash: string,
) {
  const text =
    'INSERT INTO users (name, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [name, username, email, password_hash];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserByEmail(email: string) {
  const text = 'SELECT * FROM users WHERE email = $1';
  const values = [email];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserByUsername(username: string) {
  const text = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  const result = await pool.query(text, values);
  return result.rows[0];
}

async function getUserById(userId: string) {
  const text = 'SELECT * FROM users WHERE id = $1';
  const values = [userId];

  const result = await pool.query(text, values);
  return result.rows[0];
}

export { createUser, getUserByEmail, getUserByUsername, getUserById };
