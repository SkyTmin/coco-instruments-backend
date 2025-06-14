# Coco Instruments Backend

## Развертывание на Railway

### Шаг 1: Подготовка

1. Создайте новый репозиторий на GitHub
2. Загрузите все файлы бэкенда в репозиторий

### Шаг 2: Настройка Railway

1. Перейдите на [Railway](https://railway.app)
2. Подключите ваш GitHub аккаунт
3. Создайте новый проект из вашего репозитория

### Шаг 3: Переменные окружения

В Railway установите следующие переменные окружения:

```bash
# База данных (используйте ваши данные PostgreSQL)
DATABASE_URL=postgresql://postgres:LOCJSSKXVfJPwhinGfXsDjivfXskTRTK@postgres.railway.internal:5432/railway
DATABASE_HOST=postgres.railway.internal
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=LOCJSSKXVfJPwhinGfXsDjivfXskTRTK
DATABASE_NAME=railway
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=false

# Приложение
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1

# JWT (ВАЖНО: измените на свой секретный ключ!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d

# CORS
CORS_ORIGIN=https://coco-instruments-production.up.railway.app
```

### Шаг 4: Запуск миграций

После развертывания выполните миграции:

1. В Railway откройте терминал проекта
2. Выполните команду:
```bash
npm run migration:run
```

### Шаг 5: Проверка

Проверьте работу API:
```
https://coco-instruments-backend-production.up.railway.app/api/v1/health
```

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `POST /api/v1/auth/refresh` - Обновление токена
- `POST /api/v1/auth/logout` - Выход
- `GET /api/v1/auth/profile` - Профиль пользователя

### Coco Money
- `GET /api/v1/finance/coco-money/sheets` - Получить листы
- `POST /api/v1/finance/coco-money/sheets` - Создать лист
- `PUT /api/v1/finance/coco-money/sheets/:id` - Обновить лист
- `DELETE /api/v1/finance/coco-money/sheets/:id` - Удалить лист
- `POST /api/v1/finance/coco-money/sheets/:id/expenses` - Добавить расход
- `GET /api/v1/finance/coco-money/categories` - Получить категории
- `POST /api/v1/finance/coco-money/categories` - Создать категорию

### Долги
- `GET /api/v1/finance/debts` - Получить долги
- `POST /api/v1/finance/debts` - Создать долг
- `PUT /api/v1/finance/debts/:id` - Обновить долг
- `DELETE /api/v1/finance/debts/:id` - Удалить долг
- `POST /api/v1/finance/debts/:id/payments` - Добавить платеж

### Размер одежды
- `GET /api/v1/clothing/size/parameters` - Получить параметры
- `POST /api/v1/clothing/size/parameters` - Сохранить параметры
- `PUT /api/v1/clothing/size/parameters` - Обновить параметры
- `POST /api/v1/clothing/size/calculate` - Рассчитать размер

### Калькулятор масштабов
- `POST /api/v1/geodesy/scale-calculator/calculate` - Рассчитать
- `GET /api/v1/geodesy/scale-calculator/history` - История
- `DELETE /api/v1/geodesy/scale-calculator/history` - Очистить историю

## Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Запуск миграций
npm run migration:run

# Создание новой миграции
npm run migration:generate -- -n MigrationName
```