# Authentication Implementation

## Overview
This document describes the authentication system implemented for the Homa Dashboard, including username/password login and OAuth social login (Google and Microsoft).

## Features Implemented

### 1. Cookie-Based Token Management
- **Duration**: 6 months (180 days)
- **Tokens Stored**:
  - `access_token`: Used for API authentication
  - `refresh_token`: Used for token refresh
- **Location**: `/src/lib/cookies.ts`

### 2. API Client Configuration
- **Base URL**: `https://api.getevo.dev`
- **Authentication**: Automatic Bearer token injection from cookies
- **Location**: `/src/services/api-client.ts`

### 3. Authentication Service
- **Login**: Email/password authentication
- **OAuth**: Google and Microsoft social login
- **Profile**: User profile retrieval
- **Token Refresh**: Automatic token refresh capability
- **Logout**: Clear authentication state
- **Location**: `/src/services/auth.service.ts`

### 4. Authentication Context
- Provides global authentication state
- Manages user data and authentication status
- Handles OAuth callbacks automatically
- **Location**: `/src/contexts/AuthContext.tsx`

### 5. Login Page
- Email/password form with validation
- Social login buttons (Google, Microsoft)
- Error handling and loading states
- Glassmorphic design matching the dashboard
- **Location**: `/app/login/page.tsx`

### 6. OAuth Callback Handler
- Processes OAuth redirects from providers
- Extracts and stores tokens
- Redirects to dashboard on success
- **Location**: `/app/auth/callback/page.tsx`

### 7. Route Protection
- Middleware-based route protection
- Redirects unauthenticated users to login
- Redirects authenticated users away from login
- Stores intended destination for post-login redirect
- **Location**: `/middleware.ts`

## API Endpoints Used

### Authentication
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/oauth/google` - Google OAuth login
- `GET /api/auth/oauth/microsoft` - Microsoft OAuth login
- `GET /api/auth/oauth/providers` - Get available OAuth providers
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/refresh-token` - Refresh access token

## API Response Structure

### Login Response
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "admin",
      "permissions": [],
      "preferences": {
        "theme": "light",
        "language": "en",
        "timezone": "UTC",
        "notifications": {
          "email": true,
          "push": true,
          "desktop": true
        }
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "lastLoginAt": "2025-01-13T00:00:00Z"
    }
  }
}
```

## Usage

### Using Authentication in Components

```tsx
import { useAuth } from '@/contexts/AuthContext'

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Manual Login

```tsx
const { login } = useAuth()

try {
  await login({
    email: 'user@example.com',
    password: 'password123'
  })
  // Redirect or show success
} catch (error) {
  // Handle error
}
```

### OAuth Login

```tsx
const { loginWithOAuth } = useAuth()

// Google login
loginWithOAuth('google')

// Microsoft login
loginWithOAuth('microsoft')
```

## OAuth Flow

1. User clicks "Continue with Google" or "Continue with Microsoft"
2. Browser redirects to `https://api.getevo.dev/api/auth/oauth/{provider}?redirect_url={callback_url}`
3. Provider authenticates user
4. Provider redirects to callback URL with OAuth response
5. Callback page (`/auth/callback`) processes the response:
   - Extracts tokens from URL parameters
   - Stores tokens in cookies
   - Stores user data in localStorage
   - Redirects to dashboard
6. AuthContext initializes with authenticated state

## Cookie Configuration

- **Max Age**: 15,552,000 seconds (180 days / 6 months)
- **Path**: `/`
- **Secure**: `true` (HTTPS only)
- **SameSite**: `lax`

## Route Protection

Protected routes automatically redirect to `/login` if user is not authenticated.
The middleware stores the intended destination and redirects back after successful login.

Public routes (no authentication required):
- `/login`
- `/lock`
- `/auth/callback`

## Testing Credentials

From the example login page:
- **Email**: reza@hashemi.dev
- **Password**: lightbear11

## Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://api.getevo.dev
```

## Security Considerations

1. **Secure Cookies**: All cookies are marked as `secure` and use `sameSite: lax`
2. **Token Storage**: Access and refresh tokens are stored in HTTP-only cookies
3. **Route Protection**: Middleware prevents unauthorized access to protected routes
4. **Token Refresh**: Automatic token refresh capability to maintain sessions
5. **Error Handling**: Comprehensive error handling for all authentication operations

## File Structure

```
src/
├── lib/
│   └── cookies.ts                    # Cookie utilities
├── services/
│   ├── api-client.ts                 # API client with auth
│   └── auth.service.ts               # Authentication service
├── contexts/
│   └── AuthContext.tsx               # Auth context provider
└── components/
    └── DashboardLayoutWrapper.tsx    # Layout with auth checks

app/
├── login/
│   └── page.tsx                      # Login page
├── auth/
│   └── callback/
│       └── page.tsx                  # OAuth callback handler
└── layout.tsx                        # Root layout with AuthProvider

middleware.ts                          # Route protection middleware
.env.local                            # Environment configuration
```

## Next Steps

1. Implement logout functionality in the UI (add logout button)
2. Add user profile page to display and edit user information
3. Implement forgot password functionality
4. Add user registration if needed
5. Set up token refresh timer
6. Add loading states during authentication checks
7. Implement remember me functionality if needed

## Troubleshooting

### Issue: "No access token" error
- **Solution**: Check that cookies are being set correctly. Verify secure flag settings match your environment (HTTPS in production, HTTP in development).

### Issue: OAuth redirect not working
- **Solution**: Ensure the redirect URL in the OAuth request matches the callback URL exactly. Check that `/auth/callback` page is accessible.

### Issue: User data not persisting
- **Solution**: Verify that cookies have proper `maxAge` and `path` settings. Check browser cookie storage.

### Issue: Middleware redirect loop
- **Solution**: Ensure public routes are properly configured in middleware. Check that auth cookies are readable by middleware.
