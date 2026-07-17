# Film — афиша кинотеатра

Учебный fullstack-проект: сервис афиши кинотеатра с бронированием билетов. Бэкенд на NestJS, фронтенд на React, база данных PostgreSQL. Приложение докеризировано и задеплоено на удалённый сервер с автоматической сборкой образов через GitHub Actions.

## Демо

Проект доступен по адресу: **https://mikhailkozkin.com/**

## Стек

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: React, Vite
- **Инфраструктура**: Docker, Docker Compose, Nginx, GitHub Actions, GHCR

## Возможности

- Просмотр афиши фильмов и расписания сеансов
- Бронирование билетов
- Гибкое логирование: три режима вывода логов (`dev`, `json`, `tskv`), переключаются через переменную окружения `LOGGER_TYPE`
- Юнит-тесты на логгеры и контроллеры

## Запуск локально

### Через Docker Compose (рекомендуется)

```bash
git clone <ссылка на репозиторий>
cd film-react-nest
cp .env.example .env
cp backend/.env.example backend/.env
docker compose up -d --build
```

pgAdmin приложение будет доступно на **https://pgadmin.mikhailkozkin.com**

### Без Docker (для разработки)

```bash
cd backend
npm install
npm run start:dev

cd ../frontend
npm install
npm run dev
```

## Тесты

```bash
cd backend
npm run lint
npm test
```

## CI/CD

При каждом пуше в ветку `main` GitHub Actions автоматически собирает и публикует три Docker-образа (backend, frontend, nginx) в GitHub Container Registry.
