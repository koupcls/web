## Authentication

| Эндпоинт | Назначение |
|----------|------------|
| `POST /auth/refresh` | Обновление истёкшего `access_token` через `refresh_token` |
| `POST /auth/logout` | Выход и отзыв текущей сессии (требует авторизации) |

> При получении `401 Unauthorized` используйте `refresh` или выполните повторный вход.

---

## Общие соглашения

- **Статус-коды:** `200` (OK), `201` (Created), `400` (Bad Request), `401` (Unauthorized), `403` (Forbidden), `404` (Not Found), `500` (Server Error)
- **Пагинация:** (если используется) передаются через query: `?page=1&limit=20`
- **Ответ об ошибке:**
  ```json
  {
    "success": false,
    "error": {
      "code": "validation_failed",
      "message": "Invalid email format"
    }
  }
  ```

---

## Authentication & Users (`/api/auth`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `POST` | `/register` | ❌ | Public | Регистрация нового пользователя |
| `POST` | `/login` | ❌ | Public | Вход в аккаунт |
| `POST` | `/otp` | ❌ | Public | Верификация OTP-кода |
| `POST` | `/resend-email` | ❌ | Public | Повторная отправка письма подтверждения |
| `POST` | `/refresh` | ❌ | Public | Обновление токена доступа |
| `POST` | `/logout` | ✅ | User | Выход из сессии |
| `GET` | `/user` | ✅ | User | Данные текущего пользователя |
| `PATCH` | `/user` | ✅ | User | Обновление профиля текущего пользователя |
| `GET` | `/user/:id` | ✅ | User | Данные конкретного пользователя |
| `PATCH` | `/user/:id` | ✅ | Admin | Обновление профиля любого пользователя |
| `DELETE` | `/user/:id` | ✅ | User | Мягкое удаление своего профиля |
| `DELETE` | `/user/:id/hard` | ✅ | Admin | Полное удаление профиля из БД |
| `GET` | `/users` | ✅ | Admin | Список всех пользователей (с пагинацией) |
  
### Параметры тела (Body)  

```json
// POST /register, POST /login, 
{
  "email": "string",
  "password": "string"
}

// POST /otp
{
  "email": "string",
  "code": "string"
}

// POST /resend-email
{
  "email": "string"
}

// PATCH /user, PATCH /user/:id
{
    "tag": "string",
    "login": "string",
    "avatar_url": "string",
    "bio": "string",
    "is_private": "string",
    "role": ["user", "admin", "moderator"]
}
```

---

## Posts (`/api/posts`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `GET` | `/` | ❌ | Public | Список постов (фильтры, пагинация) |
| `GET` | `/:id` | ❌ | Public | Детальная информация о посте |
| `POST` | `/` | ✅ | User | Создание нового поста |
| `PATCH` | `/:id` | ✅ | User | Редактирование поста (автор/админ) |
| `DELETE` | `/:id` | ✅ | User | Мягкое удаление поста |
| `DELETE` | `/:id/hard` | ✅ | Admin | Полное удаление поста и связанных данных |
| `POST` | `/:id/publish` | ✅ | User | Публикация черновика |
  
### Параметры тела (Body)

```json
// POST /, PATCH /:id
{
  "title": "string",
  "description": "string",
  "summary": "string (опционально)",
  "cookingTimeMinutes": 45,
  "portionsCount": 4,
  "status": "draft | published",
  "tags": ["uuid_1", "uuid_2"],
  "images": [
    {
      "url": "https://storage.example.com/images/main.jpg",
      "thumbnailUrl": "https://storage.example.com/images/thumbnails/main.jpg",
      "alt": "Готовое блюдо сверху",
      "displayOrder": 0,
      "isCover": true
    }
  ],
  "instructionSteps": [
    {
      "order": 1,
      "content": "Шаг 1: Разогрейте духовку до 180°C...",
      "images": [
        {
          "url": "https://storage.example.com/steps/1.jpg",
          "thumbnailUrl": "https://storage.example.com/steps/thumbs/1.jpg",
          "alt": "Замешивание теста",
          "displayOrder": 0
        }
      ]
    }
  ],
  "ingredientStages": [
    {
      "name": "Для теста",
      "order": 1,
      "ingredients": [
        {
          "ingredientId": "uuid_ingredient_1",
          "measurementId": "uuid_measurement_1",
          "quantity": 250.5,
          "isOptional": false,
          "note": "Просеять дважды",
          "order": 1
        }
      ]
    }
  ]
}

// Query (GET /)
// ?page=1&limit=10&tag=cooking&status=draft&author=uuid
```

---

## Tags (`/api/tags`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `GET` | `/` | ❌ | Public | Список тегов |
| `GET` | `/popular` | ❌ | Public | Топ-теги по частоте использования |
| `GET` | `/:id` | ❌ | Public | Тег по ID |
| `GET` | `/slug/:slug` | ❌ | Public | Тег по человекочитаемому slug |
| `POST` | `/` | ✅ | User | Создание тега |
| `PATCH` | `/:id` | ✅ | User | Обновление тега |
| `DELETE` | `/:id` | ✅ | User | Удаление тега |

### Параметры тела (Body)

```json
// POST /, PATCH /:id
{
  "name": "string",
  "slug": "string",
  "color": "#hex",
  "category_id": "uuid",
  "emblem_img": "url"
}
```

---

## Tag Categories (`/api/tag-categories`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `GET` | `/` | ❌ | Public | Список категорий тегов |
| `GET` | `/all` | ❌ | Public | Все категории (без пагинации) |
| `GET` | `/:id` | ❌ | Public | Категория по ID |
| `POST` | `/` | ✅ | User | Создание категории |
| `PATCH` | `/:id` | ✅ | User | Обновление категории |
| `DELETE` | `/:id` | ✅ | User | Удаление категории |

### Параметры тела (Body)

```json
// POST /, PATCH /:id
{
    "code": "string",
    "name": "string",
    "description": "string",
    "display_order": "number",
}
```

---

## Ingredients (`/api/ingredients`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `GET` | `/` | ❌ | Public | Список ингредиентов |
| `GET` | `/autocomplete` | ❌ | Public | Поиск по вводу (для dropdown) |
| `GET` | `/:id` | ❌ | Public | Ингредиент по ID |
| `GET` | `/code/:code` | ❌ | Public | Ингредиент по внутреннему коду |
| `POST` | `/` | ✅ | Admin | Создание ингредиента |
| `PATCH` | `/:id` | ✅ | Admin | Обновление ингредиента |
| `DELETE` | `/:id` | ✅ | Admin | Удаление ингредиента |

> Мутирующие эндпоинты доступны **только администраторам**.

### Параметры тела (Body)

```json
// POST /, PATCH /:id
{
    "name": "string",
    "code": "string",
    "density": "number",
}

// Query (GET /autocomplete)
// ?q=мука&limit=5
```

---

## Measurement Units (`/api/measurements`)

| Method | Endpoint | Auth | Role | Описание |
|--------|----------|------|------|----------|
| `GET` | `/` | ❌ | Public | Список единиц измерения |
| `GET` | `/autocomplete` | ❌ | Public | Поиск по вводу |
| `GET` | `/:id` | ❌ | Public | Единица по ID |
| `GET` | `/code/:code` | ❌ | Public | Единица по коду (г, мл, шт) |
| `POST` | `/` | ✅ | Admin | Создание единицы |
| `PATCH` | `/:id` | ✅ | Admin | Обновление единицы |
| `DELETE` | `/:id` | ✅ | Admin | Удаление единицы |

### Параметры тела (Body)

```json
// POST /, PATCH /:id
{
    "name": "string",
    "code": "string",
    "grams_coefficient": "number",
    "is_weight": "boolean"
}
```
