# --- Development/Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем tini (обработка сигналов SIGTERM и др.) и bash для удобства (опционально)
RUN apk add --no-cache bash

# Копируем только package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости полностью, чтобы собрать проект
RUN npm ci

# Копируем исходники
COPY . .

# Собираем NestJS проект
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine as production

WORKDIR /app

# Копируем только собранное приложение и зависимости
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Устанавливаем переменные окружения (можно переопределить при запуске)
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main"]
