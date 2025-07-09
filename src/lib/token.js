import fs from 'fs/promises';
const TOKEN_FILE = 'access_token.txt';

export async function saveToken(token) {
  await fs.writeFile(TOKEN_FILE, token, 'utf8');
}

export async function loadToken() {
  try {
    return (await fs.readFile(TOKEN_FILE, 'utf8')).trim();
  } catch {
    return null;
  }
}
