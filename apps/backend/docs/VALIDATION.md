# Data Validation System

This document describes the comprehensive data validation system implemented across all backend controllers.

## Overview

The validation system uses **Zod v4** for schema-based validation with a custom middleware that validates request data before it reaches the controllers.

## Architecture

### Components

1. **Validation Schemas** (`src/validations/`)
   - Define validation rules for each endpoint
   - Located in separate files per resource (auth, chat, message, user)

2. **Validation Middleware** (`src/middlewares/validate.middleware.ts`)
   - Reusable middleware that applies Zod schemas
   - Validates `body`, `query`, and `params`
   - Returns formatted error messages

3. **Routes** (`src/routes/`)
   - Apply validation middleware before controller handlers
   - Ensure data is validated before processing

## Validation Schemas

### Auth Validation (`validations/auth.validation.ts`)

#### Register Schema

```typescript
{
  body: {
    userName: string (3-30 chars, trimmed)
    email: string (valid email, lowercase, trimmed)
    password: string (6-100 chars)
  }
}
```

#### Login Schema

```typescript
{
  body: {
    email: string (valid email, lowercase, trimmed)
    password: string (min 1 char)
  }
}
```

### Chat Validation (`validations/chat.validation.ts`)

#### Create Chat Schema

```typescript
{
  body: {
    userId: string (valid MongoDB ObjectId)
  }
}
```

#### Create Group Chat Schema

```typescript
{
  body: {
    name: string (3-50 chars, trimmed)
    users: string[] (1-50 valid ObjectIds)
  }
}
```

#### Get Chat By ID Schema

```typescript
{
  params: {
    id: string (valid MongoDB ObjectId)
  }
}
```

### Message Validation (`validations/message.validation.ts`)

#### Send Message Schema

```typescript
{
  body: {
    content: string (1-5000 chars, trimmed)
    chat: string (valid MongoDB ObjectId)
  }
}
```

#### Get All Messages Schema

```typescript
{
  query: {
    chat: string (valid MongoDB ObjectId)
  }
}
```

#### Update Message Schema

```typescript
{
  body: {
    messageId: string (valid MongoDB ObjectId)
    status: 'sent' | 'delivered' | 'read' (optional)
  }
}
```

### User Validation (`validations/user.validation.ts`)

#### Get User Schema

```typescript
{
  params: {
    id: string (valid MongoDB ObjectId)
  }
}
```

## Usage

### In Routes

```typescript
import { validate } from '@/middlewares/validate.middleware';
import { registerSchema } from '@/validations/auth.validation';

router.post('/register', validate(registerSchema), register);
```

### Error Response Format

When validation fails, the API returns:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email address"
    },
    {
      "field": "body.password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

## Benefits

1. **Type Safety**: Zod provides compile-time type checking
2. **Centralized Validation**: All validation logic in one place
3. **Consistent Error Messages**: Uniform error format across all endpoints
4. **Early Validation**: Catches invalid data before controller logic
5. **Reduced Boilerplate**: No manual validation checks in controllers
6. **ObjectId Validation**: Custom validator for MongoDB ObjectIds
7. **Automatic Sanitization**: Trimming, lowercasing, etc.

## Custom Validators

### MongoDB ObjectId Validator

```typescript
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });
```

This ensures all ObjectId fields are validated before database queries.

## Adding New Validations

1. **Create Schema** in appropriate validation file:

```typescript
export const newSchema = z.object({
  body: z.object({
    field: z.string().min(1, 'Field is required'),
  }),
});
```

2. **Apply to Route**:

```typescript
router.post('/endpoint', validate(newSchema), controller);
```

3. **Remove Manual Validation** from controller (if any)

## Testing Validation

### Valid Request

```bash
POST /api/auth/register
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
# Response: 201 Created
```

### Invalid Request

```bash
POST /api/auth/register
{
  "userName": "ab",
  "email": "invalid-email",
  "password": "123"
}
# Response: 400 Bad Request
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.userName",
      "message": "Username must be at least 3 characters"
    },
    {
      "field": "body.email",
      "message": "Invalid email address"
    },
    {
      "field": "body.password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

## Validation Rules Summary

| Endpoint       | Field     | Rules                           |
| -------------- | --------- | ------------------------------- |
| Register       | userName  | 3-30 chars, trimmed             |
| Register       | email     | Valid email, lowercase, trimmed |
| Register       | password  | 6-100 chars                     |
| Login          | email     | Valid email, lowercase, trimmed |
| Login          | password  | Min 1 char                      |
| Create Chat    | userId    | Valid ObjectId                  |
| Create Group   | name      | 3-50 chars, trimmed             |
| Create Group   | users     | 1-50 valid ObjectIds            |
| Send Message   | content   | 1-5000 chars, trimmed           |
| Send Message   | chat      | Valid ObjectId                  |
| Update Message | messageId | Valid ObjectId                  |
| Update Message | status    | 'sent', 'delivered', or 'read'  |

## Future Enhancements

- [ ] Add custom error messages per field
- [ ] Implement rate limiting validation
- [ ] Add file upload validation
- [ ] Create validation for nested objects
- [ ] Add conditional validation rules
