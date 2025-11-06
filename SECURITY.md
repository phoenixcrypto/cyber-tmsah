# 🔒 Security Documentation - Cyber TMSAH Platform

## Overview
This document outlines the security measures implemented to protect the admin panel and student data.

---

## 🛡️ Admin Panel Protection

### 1. **Server-Side Authentication**
- All admin pages use **server-side verification** via `requireAdmin()` function
- JWT tokens are verified on the server before rendering any content
- Database verification ensures admin account is active

### 2. **API Route Protection**
All `/api/admin/*` routes are protected with:
- ✅ JWT token verification
- ✅ Role-based access control (admin only)
- ✅ Database verification (active admin account)
- ✅ Rate limiting (prevents brute force attacks)

### 3. **Frontend Protection**
- Client-side checks prevent unauthorized UI rendering
- Automatic redirects to login if not authenticated
- Token expiration handling

### 4. **Security Headers**
Admin routes include enhanced security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: no-referrer` - Prevents referrer leakage
- `Cache-Control: no-store` - Prevents caching sensitive data

---

## 🔐 Authentication & Authorization

### JWT Tokens
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration
- **Secret**: Stored in environment variable (`JWT_SECRET`)
- **Algorithm**: HS256

### Password Security
- **Hashing**: bcrypt with 12 rounds (production)
- **Minimum Length**: 8 characters
- **Requirements**: Not enforced (can be added)

### Rate Limiting
- **Login Attempts**: Limited per IP address
- **API Requests**: 5 requests per minute for admin operations
- **Account Lockout**: After multiple failed attempts

---

## 🗄️ Database Security

### Row Level Security (RLS)
All tables have RLS enabled with strict policies:

#### Users Table
- ✅ Students can only view their own data
- ✅ Admins can view all users (except password_hash)
- ✅ No direct inserts/deletes via RLS (must use API)
- ✅ Students cannot change role, section, or group

#### Verification List
- ✅ Only admins can view/insert/update
- ✅ No direct deletes allowed

#### Articles & Tasks
- ✅ Students see only their section content
- ✅ Only published content is visible
- ✅ Admins can manage all content

#### Task Submissions
- ✅ Users can only view their own submissions
- ✅ No direct updates/deletes allowed

### Security Functions
- `is_admin(user_id)` - Checks if user is active admin
- `is_active_student(user_id)` - Checks if user is active student

---

## 🌐 Network Security

### HTTPS
- **Required**: All production traffic must use HTTPS
- **HSTS**: Enabled with 1 year max-age
- **Preload**: Enabled for HSTS

### CORS
- **Origin**: Restricted to same origin
- **Credentials**: Required for authenticated requests

### Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
```

---

## 🔍 Security Best Practices

### ✅ Implemented
1. Server-side authentication for all admin routes
2. JWT token verification on every API request
3. Database-level access control (RLS)
4. Rate limiting on sensitive operations
5. Password hashing with bcrypt
6. Security headers on all routes
7. HTTPS enforcement
8. Input validation (Zod schemas)
9. SQL injection prevention (parameterized queries)
10. XSS prevention (React escaping)

### ⚠️ Recommendations
1. **2FA**: Consider adding two-factor authentication for admin accounts
2. **Audit Logging**: All admin actions are logged (audit_logs table)
3. **Session Management**: Implement session timeout warnings
4. **IP Whitelisting**: Consider IP whitelisting for admin access
5. **Password Policy**: Enforce strong password requirements
6. **Regular Security Audits**: Schedule periodic security reviews

---

## 🚨 Incident Response

### If Admin Account is Compromised
1. Immediately disable the account in database:
   ```sql
   UPDATE users SET is_active = FALSE WHERE username = 'admin';
   ```
2. Change JWT_SECRET in environment variables
3. Force all users to re-authenticate
4. Review audit logs for suspicious activity
5. Rotate all credentials

### If Data Breach is Suspected
1. Enable maintenance mode
2. Review RLS policies
3. Check audit logs
4. Notify affected users
5. Rotate all secrets and keys

---

## 📋 Security Checklist

- [x] Server-side admin verification
- [x] JWT token protection
- [x] Database RLS policies
- [x] Rate limiting
- [x] Password hashing
- [x] Security headers
- [x] HTTPS enforcement
- [x] Input validation
- [x] SQL injection prevention
- [x] XSS prevention
- [ ] 2FA (optional)
- [x] Audit logging
- [ ] IP whitelisting (optional)
- [ ] Password policy enforcement (optional)

---

## 🔗 Related Files

- `lib/auth/admin.ts` - Admin authentication helpers
- `lib/security/jwt.ts` - JWT token management
- `lib/security/password.ts` - Password hashing
- `lib/security/rateLimit.ts` - Rate limiting
- `supabase/schema.sql` - Database schema and RLS policies
- `middleware.ts` - Route protection middleware
- `next.config.js` - Security headers configuration

---

**Last Updated**: 2024
**Version**: 1.0

