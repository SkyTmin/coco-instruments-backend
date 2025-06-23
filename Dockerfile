# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем необходимые инструменты для сборки
RUN apk add --no-cache python3 make g++ curl bash

# Копируем файлы зависимостей
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm ci

# Копируем исходный код
COPY src ./src

# ВАЖНО: Проверяем структуру и компилируем с подробным логированием
RUN echo "=== Checking source files ===" && \
    ls -la && \
    ls -la src/ && \
    echo "=== Running TypeScript compilation ===" && \
    npm run build && \
    echo "=== Build completed, checking dist ===" && \
    ls -la dist/ && \
    echo "=== Dist contents ===" && \
    find dist -type f | head -20

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package.json для установки production зависимостей
COPY package*.json ./
RUN npm ci --only=production

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist

# Копируем .env если нужно (для Railway это не обязательно)
# COPY .env* ./

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main.js"]
