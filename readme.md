# Project "Social Network - app Social Media - Backend" | Проєкт "Social Network - додаток Social Media - Backend"

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-pg_8.21-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-FF8C00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/REST_API-005C84?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemailer-Email-22B573?style=for-the-badge" />
</p>

---

## Навігація | Navigation

- [Мета проєкту | Project Goal](#мета-проєкту--project-goal)
- [Склад команди | Team](#склад-команди--team)
- [Перелік технологій | Technologies](#перелік-технологій--technologies)
- [Зміст проєкту | Project Structure](#зміст-проєкту--project-structure)
- [Як встановити та запустити проєкт? | How to install and run?](#як-встановити-та-запустити-проєкт--how-to-install-and-run-the-project)
- [Висновок | Conclusion](#висновок--conclusion)

---

## Мета проєкту | Project Goal

Цей проєкт — навчальний серверний застосунок для мобільної соціальної мережі. Він буде корисний початківцям, які хочуть на практиці вивчити побудову **REST API** на **Express + TypeScript**, роботу з реляційними базами даних через **Prisma ORM**, реалізацію **real-time** комунікації через **Socket.IO**, автентифікацію на основі **JWT** із підтвердженням через email (**Nodemailer**), а також зберігання медіафайлів у хмарі через **Cloudinary**.

---

This project is an educational backend application for a mobile social network. It will be useful for beginners who want to practise building a **REST API** with **Express + TypeScript**, working with relational databases via **Prisma ORM**, implementing **real-time** communication with **Socket.IO**, **JWT**-based authentication with email confirmation via **Nodemailer**, and cloud media storage via **Cloudinary**.

---

## Склад команди | Team

- [Julia Ovcharenko](https://github.com/JuliaOvcharenko)
- [Oleksandr Voloshyn](https://github.com/SashaVolo)

---

## Перелік технологій | Technologies

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-7.7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-pg_8.21-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/bcrypt-6.0-525252?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Nodemailer-8.0-22B573?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloudinary-2.10-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/Multer-2.1-FF6600?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Sharp-0.34-99CC00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Yup-1.7-FF4154?style=for-the-badge" />
  <img src="https://img.shields.io/badge/envalid-8.1-8A2BE2?style=for-the-badge" />

</p>

---

## Зміст проєкту | Project Structure

Серверна частина побудована на **Express 5** з модульною архітектурою. Кожен функціональний блок винесено в окремий модуль із власними роутами, контролерами та сервісами.

The backend is built on **Express 5** with a modular architecture. Each functional block is extracted into a separate module with its own routes, controllers, and services.

---

<details>
  <summary><strong>Автентифікація | Authentication Module</strong></summary>

---

Модуль відповідає за реєстрацію та вхід користувача.

**Реєстрація** відбувається у два кроки:
1. Користувач надсилає форму з email та паролем.
2. На пошту надсилається лист із **кодом підтвердження** через **Nodemailer**. Лише після введення коду акаунт активується та видається **JWT**-токен.

**Вхід** — перевірка email і пароля (хешування через **bcrypt**), видача токена.

Токен передається в заголовку запиту та верифікується **middleware** на захищених маршрутах.

---

This module handles user registration and login.

**Registration** is a two-step flow:
1. The user submits a form with their email and password.
2. A **confirmation code** is sent to their inbox via **Nodemailer**. Only after entering the code is the account activated and a **JWT** token issued.

**Login** — verifies email and password (hashed via **bcrypt**), then issues a token.

The token is passed in the request header and verified by **middleware** on protected routes.

</details>

---

<details>
  <summary><strong>Користувачі | Users Module</strong></summary>

---

Модуль керує профілями користувачів: отримання та оновлення особистих даних, завантаження аватара через **Multer** + обробка зображення через **Sharp** + збереження у **Cloudinary**.

Зберігається повна **історія аватарок** — кожен завантажений аватар прив'язується до профілю і доступний для перегляду або відновлення.

---

This module manages user profiles: fetching and updating personal data, uploading an avatar via **Multer**, processing it with **Sharp**, and storing it in **Cloudinary**.

A full **avatar history** is maintained — every uploaded avatar is linked to the profile and can be viewed or restored.

</details>

---

<details>
  <summary><strong>Друзі | Friends Module</strong></summary>

---

Модуль реалізує систему друзів із чотирма статусами відносин між користувачами:

- `PENDING` — запит надіслано, очікує підтвердження.
- `ACCEPTED` — запит прийнято, користувачі є друзями.
- `DECLINED` — запит відхилено.
- `REMOVED` — видалено з друзів.

Надсилання повідомлень доступне лише між взаємними друзями зі статусом `ACCEPTED`.

---

This module implements the friends system with four relationship statuses:

- `PENDING` — request sent, awaiting confirmation.
- `ACCEPTED` — request accepted, users are friends.
- `DECLINED` — request declined.
- `REMOVED` — removed from friends.

Messaging is only available between mutual friends with `ACCEPTED` status.

</details>

---

<details>
  <summary><strong>Публікації | Posts Module</strong></summary>

---

Модуль для створення, редагування, видалення та отримання публікацій. Підтримує завантаження зображень через **Multer** + **Cloudinary**. Стрічка повертає пости відсортовані за датою.

---

Module for creating, editing, deleting, and fetching posts. Supports image uploads via **Multer** + **Cloudinary**. The feed returns posts sorted by date.

</details>

---

<details>
  <summary><strong>Альбоми | Albums Module</strong></summary>

---

Модуль керує фотоальбомами користувача:

- **Мої фото** — CRUD для альбомів-колажів: створення альбому, додавання / видалення фото, перегляд у сітці.
- **Аватарки** — автоматична фіксація кожної зміни аватара; ендпоінт повертає всю хронологію фото профілю.

---

This module manages user photo albums:

- **My Photos** — CRUD for collage albums: create an album, add / remove photos, display as a grid.
- **Avatar History** — automatically records every avatar change; the endpoint returns the full profile photo timeline.

</details>

---

<details>
  <summary><strong>Чат | Chat Module (Socket.IO)</strong></summary>

---

Real-time чат між користувачами реалізований через **Socket.IO**. Підтримуються особисті та групові кімнати. Повідомлення зберігаються в базі даних через **Prisma**, тому при підключенні підвантажується історія чату. Доступ до чату мають лише взаємні друзі.

---

Real-time chat between users is implemented via **Socket.IO**. Private and group rooms are supported. Messages are persisted in the database via **Prisma**, so chat history loads on connection. Only mutual friends have access to the chat.

</details>

---

## Як встановити та запустити проєкт? | How to install and run the project?

<details>
  <summary><strong>For any OS</strong></summary>

1. Перед початком переконайтесь, що на вашому компʼютері встановлено | Make sure you have installed:

- **Node.js** (LTS) — перевірка / check: `node -v`
- **Git** — перевірка / check: `git --version`
- **PostgreSQL** або доступ до хмарної БД | or access to a cloud DB

---

2. Склонуйте репозиторій | Clone the repository:

```bash
git clone https://github.com/your-repo/socialmedia-backend
```

3. Перейдіть в папку проєкту | Go to the project folder:

```bash
cd socialmedia-backend
```

4. Встановіть залежності | Install dependencies:

```bash
npm install
```

5. Створіть файл `.env` у корені проєкту та заповніть змінні | Create a `.env` file and fill in the variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/socialmedia"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
MAIL_USER="your_email@gmail.com"
MAIL_PASS="your_app_password"
PORT=3000
```

6. Застосуйте міграції Prisma | Apply Prisma migrations:

```bash
npm run migrate
```

7. Запустіть сервер | Start the server:

```bash
npm start
```

Сервер запуститься на `http://localhost:3000` | The server will run at `http://localhost:3000`.

</details>

---

## Висновок | Conclusion

Робота над серверною частиною проєкту дала практичний досвід побудови повноцінного **REST API** на **Express + TypeScript** із реальними бізнес-сценаріями: двокрокова реєстрація з підтвердженням через email, система друзів зі статусами, real-time чат, хмарне зберігання медіафайлів та повна модульна архітектура.

Проєкт можна розвивати далі: додати **push-сповіщення**, реалізувати **стрічку рекомендацій** на основі спільних друзів, впровадити **rate limiting** та **refresh-токени** для підвищення безпеки.

---

Working on the backend gave us hands-on experience building a production-style **REST API** with **Express + TypeScript**, covering real-world scenarios: two-step email-confirmed registration, a friend system with statuses, real-time chat, cloud media storage, and a fully modular architecture.

The project can be further developed by adding **push notifications**, a **recommendations feed** based on mutual friends, and **rate limiting** with **refresh tokens** for improved security.
