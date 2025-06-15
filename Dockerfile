# --- Development/Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем bash и другие инструменты
RUN apk add --no-cache bash

# Копируем только package.json и lock файл
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Сборка проекта NestJS
RUN npm run build

# ✅ ВРЕМЕННО: Выполняем миграции сразу после сборки
RUN npm run migration:run

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/main"]
