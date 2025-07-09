# Используем официальный Node
FROM node:20

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё приложение
COPY . .

# Открываем порт
EXPOSE 5000

# Стартовое команд
CMD ["node", "server.js"]
