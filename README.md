---

# 📌 Habr Career Integration Bot

Этот проект реализует сервер для интеграции с Habr Career API, который:

✅ Авторизуется через OAuth 2.0
✅ Забирает отклики на вакансии
✅ Фильтрует новые отклики (только «сегодня»)
✅ Кэширует обработанные заявки
✅ Отправляет уведомления через вебхук Pachca

---

## 🚀 Структура проекта

```
habr/
  Dockerfile
  docker-compose.yml
  .env
  server.js
  package.json
  src/
    routes/
      auth.js
      vacancies.js
    lib/
      token.js
      cache.js
      habrApi.js
      webhook.js
      utils.js
    cron/
      jobs.js
```

---

## ⚡️ Основные возможности

* Авторизация через Habr OAuth 2.0
* Кэширование токена доступа в файле
* Кэширование ID откликов для избежания повторов
* Периодическая проверка новых откликов через cron
* Отправка уведомлений в чат Pachca
* Очистка кэша каждый новый день

---

## ✅ Требования

* Node.js 20+
* Docker и Docker Compose (для контейнерного запуска)
* Домен с настроенным HTTPS и доступом к серверу
* Зарегистрированное приложение на [Habr Career](https://career.habr.com) с указанным Redirect URI
* Конфигурация вебхука Pachca (токен и URL)

---

## ✅ Переменные окружения (.env)

В корне проекта создайте файл **.env**.

**Пример:**

```
CLIENT_ID=your_habr_client_id
CLIENT_SECRET=your_habr_client_secret
REDIRECT_URI=https://localhost_or_your_domain/callback

AUTH_URL=https://career.habr.com/integrations/oauth/authorize
TOKEN_URL=https://career.habr.com/integrations/oauth/token
API_BASE_URL=https://career.habr.com/api/

SERVER_URL=localhost_or_your_domain

WEBHOOK_URL=your_pachca_webhook_url
BEARER_TOKEN=https://your_pachca_bearer_token
```

✅ Важное замечание:

* `REDIRECT_URI` должен точно совпадать с указанным в настройках приложения на Habr.

---

## ✅ Локальный запуск (без Docker)

1️⃣ Установите зависимости:

npm install

2️⃣ Запустите сервер:

npm start

3️⃣ Откройте браузер:

http://localhost:5000/

✅ Кнопка «Login» отправит на Habr OAuth. После авторизации вернёт на `/callback`.

---

## ✅ Запуск через Docker

### 1️⃣ Постройте и запустите контейнер

docker-compose up --build

✅ Контейнер автоматически:

* Подтянет переменные из .env
* Прокинет порт 5000
* Смонтирует текущую папку в контейнер (для горячей перезагрузки)

---

### 2️⃣ Доступ

✅ Локально:

http://localhost:5000

✅ На сервере (через Nginx или другой proxy):

https://your-domain.com

---

### 3️⃣ Пример Nginx-конфигурации

```nginx
server {
    listen 443 ssl;
    server_name pachcaapi.ru;

    ssl_certificate     /etc/ssl/certs/your_cert.pem;
    ssl_certificate_key /etc/ssl/private/your_key.pem;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

✅ Убедитесь, что `REDIRECT_URI` в .env совпадает с этим доменом:

```
REDIRECT_URI=https://localhost_or_your_domain/callback
```

---

## ✅ Cron-задачи

При запуске контейнера автоматически активируются:

✅ Проверка новых откликов каждые 5 минут
cron
*/5 * * * *

✅ Очистка кэша каждый день в полночь (по Москве)
cron
0 0 * * *

---

## ✅ Файлы данных

✅ `access_token.txt`

* хранит актуальный OAuth-токен Habr

✅ `cache.json`

* список ID откликов, уже обработанных сегодня

---

## ✅ Основные команды

🔹 Запуск разработки (локально):

npm start

🔹 Сборка и запуск в Docker:

docker-compose up --build

🔹 Остановка контейнера:

docker-compose down

---

## ✅ Полезные ссылки

* [Habr Career OAuth](https://career.habr.com/integrations)
* [Pachca API](https://api.pachca.com)

---

## ✅ Авторизация

При первом запуске:

✅ Перейдите на `/`
✅ Нажмите «Login»
✅ Авторизуйтесь через Habr
✅ Приложение сохранит access_token

---

✅ Структура кода разделена на:

* **routes** (маршруты)
* **lib** (логика интеграции, кэш)
* **cron** (запланированные задачи)

---
