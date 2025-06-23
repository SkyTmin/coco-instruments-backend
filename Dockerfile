# Простой Dockerfile без multi-stage для отладки
FROM node:20-alpine

WORKDIR /app

# Устанавливаем инструменты для сборки
RUN apk add --no-cache python3 make g++ curl bash

# Копируем все файлы
COPY . .

# Устанавливаем зависимости
RUN npm ci

# Компилируем с подробным выводом
RUN echo "=== Starting build ===" && \
    npm run build || (echo "BUILD FAILED!" && ls -la && exit 1)

# Проверяем что dist существует
RUN if [ ! -d "dist" ]; then \
      echo "ERROR: dist directory not found!"; \
      echo "Current directory contents:"; \
      ls -la; \
      exit 1; \
    fi

# Удаляем исходники для уменьшения размера
RUN rm -rf src/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
