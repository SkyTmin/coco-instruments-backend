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

# Проверяем наличие TypeScript
RUN npx tsc --version

# Сборка проекта NestJS
RUN npm run build

# Проверяем что файлы собрались
RUN ls -la dist/

# Проверяем структуру database в dist
RUN ls -la dist/database/ || echo "No database folder in dist"

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

# Устанавливаем только production зависимости и curl для health checks
RUN apk add --no-cache curl

# Копируем только package.json и lock файл
COPY package*.json ./
RUN npm ci --only=production

# Копируем собранное приложение (миграции уже скомпилированы внутри)
COPY --from=builder /app/dist ./dist

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Улучшенная health check команда
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Запускаем приложение
CMD ["node", "dist/main"]
