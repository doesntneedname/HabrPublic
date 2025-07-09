import axios from 'axios';
import { DateTime } from 'luxon';
import { loadToken, saveToken } from './token.js';
import { loadCache, updateCache } from './cache.js';
import { sendWebhook } from './webhook.js';

const {
  CLIENT_ID, CLIENT_SECRET, REDIRECT_URI,
  AUTH_URL, TOKEN_URL, API_BASE_URL
} = process.env;

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code'
  });
  return `${AUTH_URL}?${params}`;
};

export async function exchangeCode(code) {
  const { data } = await axios.post(TOKEN_URL, {
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  });
  await saveToken(data.access_token);
}

export async function processVacancies() {
  const token = await loadToken();
  if (!token) throw new Error('Access token missing');

  const headers = { Authorization: `Bearer ${token}`, 'User-Agent': 'HabrBot/1.0' };
  const { data } = await axios.get(`${API_BASE_URL}v1/integrations/vacancies/`, { headers });
  const ids = data.vacancies.map(v => v.id);

  const allResponses = [];
  for (const id of ids) {
    try {
      const res = await axios.get(`${API_BASE_URL}v1/integrations/vacancies/${id}/responses?page=1`, { headers });
      const todays = res.data.responses.filter(r => isToday(r.created_at));
      allResponses.push(...todays.map(r => ({ ...r, vacancy_id: id })));
    } catch (e) {
      console.error(`Vacancy ${id} error: ${e.message}`);
    }
  }

  const cached = await loadCache();
  const newOnes = allResponses.filter(r => !cached.includes(r.id));
  await updateCache(allResponses);

  for (const r of newOnes) await sendWebhook(r, headers);
  return newOnes;
}

function isToday(date) {
  return DateTime.fromISO(date, { zone: 'UTC' })
    .setZone('Europe/Moscow')
    .hasSame(DateTime.now().setZone('Europe/Moscow'), 'day');
}
