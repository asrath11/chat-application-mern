# Profile Management API Documentation

## Overview

API endpoints for user profile management including profile updates and password changes.

## Authentication

All endpoints require JWT authentication via the `Authorization` header or cookies.

## Endpoints

### 1. Update Profile

Updates the authenticated user's profile information.

**Endpoint:** `PUT /api/users/profile`

**Authentication:** Required

**Request Body:**

```json
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Request Body Schema:**

- `name` (string, required): User's display name (minimum 1 character, trimmed)
- `avatar` (string, optional): URL to user's avatar image (must be valid URL or empty string)

**Success Response (200 OK):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "isOnline": true,
    "lastSeen": "2025-12-14T10:30:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-12-14T10:30:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input

```json
{
  "message": "Name is required"
}
```

- **401 Unauthorized** - Not authenticated

```json
{
  "message": "Unauthorized"
}
```

- **404 Not Found** - User not found

```json
{
  "message": "User not found"
}
```

---

### 2. Update Password

Changes the authenticated user's password.

**Endpoint:** `PUT /api/users/password`

**Authentication:** Required

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Request Body Schema:**

- `currentPassword` (string, required): User's current password
- `newPassword` (string, required): New password (minimum 6 characters)

**Success Response (200 OK):**

```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input

```json
{
  "message": "New password must be at least 6 characters"
}
```

- **401 Unauthorized** - Wrong current password or not authenticated

```json
{
  "message": "Current password is incorrect"
}
```

- **404 Not Found** - User not found

```json
{
  "message": "User not found"
}
```

---

## Validation Rules

### Profile Update

- **Name**:
  - Required field
  - Minimum 1 character after trimming
  - Whitespace is automatically trimmed
- **Avatar**:
  - Optional field
  - Must be a valid URL format if provided
  - Can be empty string to remove avatar
  - Whitespace is automatically trimmed

### Password Update

- **Current Password**:
  - Required field
  - Must match the user's existing password
- **New Password**:
  - Required field
  - Minimum 6 characters
  - Automatically hashed before storage using bcrypt

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **Password Comparison**: Uses bcrypt's secure comparison to prevent timing attacks
3. **JWT Authentication**: All endpoints require valid JWT token
4. **Field Selection**: Password and refresh token are never returned in responses
5. **Validation**: Zod schemas validate all input data

## Database Operations

### Profile Update

- Uses `findByIdAndUpdate` with `runValidators: true`
- Returns updated document with `new: true`
- Excludes sensitive fields (password, refreshToken)

### Password Update

- Fetches user document with password field
- Validates current password using bcrypt comparison
- Updates password field (triggers pre-save hook for hashing)
- Saves document to trigger password hashing

## Usage Examples

### cURL Examples

**Update Profile:**

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jane Smith",
    "avatar": "https://example.com/jane.jpg"
  }'
```

**Update Password:**

```bash
curl -X PUT http://localhost:3000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "currentPassword": "oldPass123",
    "newPassword": "newPass456"
  }'
```

### JavaScript/TypeScript Example

```typescript
// Update Profile
const updateProfile = async (name: string, avatar?: string) => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  });
  return response.json();
};

// Update Password
const updatePassword = async (currentPassword: string, newPassword: string) => {
  const response = await fetch('/api/users/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response.json();
};
```

## Testing

### Test Cases

1. **Profile Update - Success**
   - Valid name and avatar URL
   - Should return updated user object

2. **Profile Update - Empty Name**
   - Empty or whitespace-only name
   - Should return 400 error

3. **Profile Update - Invalid Avatar URL**
   - Invalid URL format
   - Should return 400 error with validation message

4. **Password Update - Success**
   - Correct current password and valid new password
   - Should return success message

5. **Password Update - Wrong Current Password**
   - Incorrect current password
   - Should return 401 error

6. **Password Update - Short New Password**
   - New password less than 6 characters
   - Should return 400 error

7. **Unauthorized Access**
   - No JWT token provided
   - Should return 401 error

## Related Files

- **Controller**: `apps/backend/src/controllers/user.controller.ts`
- **Routes**: `apps/backend/src/routes/user.route.ts`
- **Validation**: `apps/backend/src/validations/user.validation.ts`
- **Model**: `apps/backend/src/models/user.model.ts`
- **Middleware**: `apps/backend/src/middlewares/protect.ts`

## Notes

- Email cannot be changed through these endpoints
- Profile updates are immediately reflected in the database
- Password changes do not invalidate existing JWT tokens
- Avatar field accepts any valid URL (no file upload functionality yet)
- All timestamps are automatically managed by MongoDB
