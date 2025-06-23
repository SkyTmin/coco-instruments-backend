# --- Development/Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем bash и необходимые инструменты
RUN apk add --no-cache bash python3 make g++ curl

# Копируем только package.json и lock файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Сборка проекта
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Устанавливаем только production зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Запуск
CMD ["node", "dist/main"]
