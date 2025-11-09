# Cyber TMSAH - Advanced Academic Platform

An advanced university-level educational platform integrating cutting-edge technology with academic excellence for superior learning experiences.

## 🚀 Features

- **Student Management**: Complete student registration and verification system
- **Content Management**: Publish articles and tasks with section/group targeting
- **Dashboard**: Personalized dashboard for students with schedule, tasks, and materials
- **Admin Panel**: Comprehensive admin interface for managing students, content, and notifications
- **Real-time Activity Tracking**: Monitor student activity and engagement
- **Secure Authentication**: JWT-based authentication with automatic token refresh
- **PWA Support**: Progressive Web App with offline capabilities

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account and project
- Gmail account (for email notifications - optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/phoenixcrypto/cyber-tmsah.git
   cd cyber-tmsah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   
   Or for Vercel deployment, use `env.vercel.example` as reference.
   
   Required environment variables:
   ```env
   # Supabase Configuration (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # JWT Secret (REQUIRED)
   # Generate a strong random string: openssl rand -base64 32
   JWT_SECRET=your_jwt_secret_here
   
   # Admin Password (REQUIRED)
   # For production, use bcrypt hash: node -e "const bcrypt=require('bcryptjs');bcrypt.hash('yourpassword',12).then(h=>console.log(h))"
   ADMIN_PASSWORD=your_admin_password_or_bcrypt_hash
   
   # Gmail SMTP (Optional - for email notifications)
   GMAIL_USER=your_gmail@gmail.com
   GMAIL_APP_PASSWORD=your_gmail_app_password
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Set up Supabase Database**
   
   Run the SQL schema from `supabase/schema.sql` in your Supabase SQL Editor.

5. **Create Supabase Storage Bucket**
   
   Create a bucket named `content-files` in Supabase Storage for file uploads.

## 🏃 Running the Application

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📁 Project Structure

```
cyber-tmsah/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── dashboard/         # Student dashboard
│   └── ...
├── lib/                    # Utility libraries
│   ├── auth/              # Authentication utilities
│   ├── security/          # Security utilities (JWT, password hashing)
│   ├── storage/           # File storage utilities
│   └── utils/              # General utilities
├── components/            # React components
├── supabase/              # Database schema and migrations
└── __tests__/             # Test files
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Seamless token refresh mechanism
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **Admin Verification**: Multi-layer admin access verification
- **Row Level Security**: Supabase RLS policies for data protection
- **Security Headers**: Comprehensive security headers

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The project is configured for Vercel with:
- Automatic deployments from `main` branch
- Serverless functions with 30s timeout
- Security headers configuration
- PWA support

## 📝 Environment Variables

See `env.vercel.example` for complete list of environment variables with descriptions.

### Important Notes:

- **ADMIN_PASSWORD**: In production, use a bcrypt hash instead of plain text
  ```bash
  node -e "const bcrypt=require('bcryptjs');bcrypt.hash('yourpassword',12).then(h=>console.log(h))"
  ```
  
- **JWT_SECRET**: Must be a strong random string (minimum 32 characters)
  ```bash
  openssl rand -base64 32
  ```

## 🧩 Key Features

### For Students
- Register with verification code
- View personalized dashboard
- Access schedule, tasks, and materials
- Filter content by section/group

### For Admins
- Manage student verification list
- Publish articles and tasks
- View student statistics
- Send notifications
- Upload and manage files

## 🛡️ Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for all sensitive data
3. **Rotate secrets regularly** (every 90 days)
4. **Use different secrets** for dev/staging/production
5. **Hash passwords** using bcrypt in production
6. **Enable RLS** on all Supabase tables

## 📚 Tech Stack

- **Framework**: Next.js 14.2.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **File Storage**: Supabase Storage
- **PWA**: next-pwa
- **Testing**: Jest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**ZEYAD MOHAMED**

## 🔗 Links

- **Homepage**: https://cyber-tmsah.vercel.app
- **Repository**: https://github.com/phoenixcrypto/cyber-tmsah

## ⚠️ Important Notes

- This is a production-ready application
- All security features are implemented
- Follow deployment best practices
- Monitor logs for any issues
- Keep dependencies updated

