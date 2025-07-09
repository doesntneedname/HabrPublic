import axios from 'axios';
import mustache from 'mustache';
import { formatCompensation } from './utils.js';

const { WEBHOOK_URL, BEARER_TOKEN, API_BASE_URL } = process.env;

export async function sendWebhook(apply, authHeaders) {
  const { user, body, vacancy_id } = apply;
  const userLogin = user.login;
  const experienceYears = Math.ceil((user.experience_total?.months || 0) / 12 * 2) / 2;
  const comp = formatCompensation(user.compensation);
  const link = `https://career.habr.com/${userLogin}`;

  const vacancyTitle = await getVacancyTitle(vacancy_id, authHeaders);
  const { email, telegram, habrLink } = await getUserContacts(userLogin, authHeaders);

  const template = `
Отклик на вакансию [{{vacancyTitle}}](https://career.habr.com/vacancies/{{vacancyId}}) от *{{userName}}*!
Опыт работы: {{experience}} лет
Ожидаемая з/п: {{value}} {{currency}}
Ссылка на резюме: {{{link}}}
Email: {{email}}
Телеграм: https://t.me/{{telegram}}
{{{habrLink}}}
🟢 **New**`;

  const content = mustache.render(template, {
    userName: user.name,
    vacancyTitle,
    vacancyId: vacancy_id,
    experience: experienceYears,
    value: comp.value,
    currency: comp.currency,
    link,
    email,
    telegram,
    habrLink
  });

  await postMessage(content, vacancy_id === 1000147972 ? 22243715 : 7431593, body);
}

async function getVacancyTitle(id, headers) {
  const { data } = await axios.get(`${API_BASE_URL}v1/integrations/vacancies/${id}`, { headers });
  return data.vacancy?.title || 'Unknown Title';
}

async function getUserContacts(login, headers) {
  const { data } = await axios.get(`${API_BASE_URL}v1/integrations/users/${login}`, { headers });
  return {
    email: data.contacts?.emails?.[0]?.value || 'Не указано',
    telegram: data.contacts?.messengers?.find(m => m.type === 'telegram')?.value || 'Не указано',
    habrLink: data.url || '',
  };
}

async function postMessage(content, entityId, body) {
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const res = await axios.post(WEBHOOK_URL, {
    message: { entity_type: 'discussion', entity_id: entityId, content }
  }, { headers });

  const messageId = res?.data?.data?.id;
  if (!messageId) return;

  const thread = await axios.post(`${WEBHOOK_URL}/${messageId}/thread`, {}, { headers });
  const threadId = thread?.data?.data?.id;
  if (!threadId) return;

  await axios.post(WEBHOOK_URL, {
    message: { entity_type: 'thread', entity_id: threadId, content: body }
  }, { headers });
}
