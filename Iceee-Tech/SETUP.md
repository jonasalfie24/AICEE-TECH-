# Aicee-Tech Medical Records Management System

Professional student medical records management platform built with React.js, Next.js, and PHP.

## Project Overview

Aicee-Tech is a comprehensive medical records management system designed for educational institutions. It features:

- **Student Portal**: Submit and manage medical records securely
- **Admin Dashboard**: Review records, approve user accounts, and manage the system
- **Authentication**: Secure user registration with admin approval workflow
- **Theme Support**: Light/Dark mode support for accessibility
- **Audit Logging**: Complete system activity tracking
- **PDF Export**: Export medical records as PDF documents

## Technology Stack

### Frontend
- **React 19** with Next.js 16
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn UI** components

### Backend
- **PHP 8.0+** API endpoints
- **MySQL 8.0+** database
- **JWT** for authentication
- **Password Hashing**: bcrypt

## Project Structure

```
/app                          # Next.js application
  /dashboard                  # Student dashboard pages
    /submit                   # Submit medical records
    /records                  # View/manage records
    /settings                 # Student settings
  /admin                      # Admin pages
    /dashboard                # Admin dashboard
    /approvals                # User approval management
    /records                  # Medical records management
    /audit                    # Audit log viewer
    /settings                 # Admin settings
  /login                      # Login page
  /signup                     # Registration page
  
/components                   # React components
  StudentSidebar.tsx
  AdminSidebar.tsx
  StudentHeader.tsx
  AdminHeader.tsx
  ProtectedRoute.tsx
  
/context                      # React context
  AuthContext.tsx             # Authentication context
  ThemeContext.tsx            # Theme management

/backend                      # PHP backend
  /api
    /auth                     # Authentication endpoints
    /medical-records          # Medical records endpoints
    /users                    # User management
    /admin                    # Admin operations
  config.php                  # Database configuration
  Database.php                # Database class
  JWT.php                     # JWT handler
  Middleware.php              # Authentication middleware
  Email.php                   # Email sending
  PDFExport.php               # PDF generation
  database.sql                # Database schema
```

## Database Schema

### Users Table
- id (PK)
- email (unique)
- password_hash
- name
- role (student/admin)
- approved (boolean)
- strand
- section
- created_at
- updated_at

### Medical Records Table
- id (PK)
- user_id (FK)
- strand
- section
- student_name
- medical_condition
- record_date
- status (draft/submitted/approved/rejected)
- created_at
- updated_at

### Audit Logs Table
- id (PK)
- user_id (FK)
- action
- entity_type
- entity_id
- old_values (JSON)
- new_values (JSON)
- ip_address
- created_at

## Setup Instructions

### Prerequisites
- Node.js 18+
- PHP 8.0+
- MySQL 8.0+
- npm or pnpm

### Frontend Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run development server:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Create a MySQL database:
```sql
CREATE DATABASE aicee_tech;
```

2. Import the database schema:
```bash
mysql -u root -p aicee_tech < backend/database.sql
```

3. Create `.env` file in the backend directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=aicee_tech
DB_PORT=3306

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=86400

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@aicee-tech.com

APP_ENV=development
APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

4. Set up a PHP development server:
```bash
cd backend
php -S localhost:3001
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Medical Records (Student)
- `GET /api/medical-records` - Get user's records
- `POST /api/medical-records` - Create new record
- `PUT /api/medical-records/{id}` - Update record
- `GET /api/medical-records/{id}/export` - Export as PDF

### User Management
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

### Admin Operations
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/pending-users` - Pending approvals
- `POST /api/users/{id}/approve` - Approve user
- `POST /api/users/{id}/reject` - Reject user
- `GET /api/admin/medical-records` - All records
- `POST /api/admin/records/{id}/approve` - Approve record
- `POST /api/admin/records/{id}/reject` - Reject record
- `GET /api/admin/audit-log` - View audit logs

## User Roles

### Student
- Register account (pending admin approval)
- Submit medical records
- View and edit own records
- Download own records as PDF
- Manage profile and password
- Change theme preference

### Admin
- Review and approve/reject new student accounts
- View all student medical records
- Approve/reject submitted records
- View audit logs
- Manage own account settings
- System-wide settings

## Features

### Authentication & Authorization
- Secure JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Account approval workflow
- Session management

### Medical Records Management
- Submit medical records with details:
  - Strand and section
  - Student name
  - Medical condition description
  - Record date
- Record status tracking (draft/submitted/approved/rejected)
- View and edit records before submission
- Download approved records as PDF

### Admin Functions
- Dashboard with key metrics
- User approval queue
- Medical record review workflow
- Comprehensive audit logging
- System monitoring

### User Experience
- Professional, clean interface
- Responsive design (mobile-friendly)
- Light/Dark theme support
- Intuitive navigation
- Clear status indicators
- Success/error notifications

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL parameterized queries (prepared statements)
- CORS configuration
- Audit logging for all actions
- Account approval before access
- IP address tracking

## Email Notifications

The system sends automatic email notifications for:
- Account approval
- Account rejection
- Record approval
- Record rejection

Email templates are located in `/backend/templates/`

## PDF Export

Medical records can be exported as PDF documents. The export includes:
- Student information
- Medical condition details
- Record date
- Approval status
- System watermark

## Future Enhancements

- Two-factor authentication
- Email verification
- Record archiving
- Advanced search and filtering
- Bulk operations
- Analytics dashboard
- Mobile app
- Document upload support
- Integration with school systems

## Deployment

### Frontend Deployment
Deploy to Vercel or any Node.js hosting:
```bash
pnpm build
```

### Backend Deployment
- Ensure PHP 8.0+ is available
- Configure MySQL database
- Set environment variables
- Set up email service (SMTP)
- Configure CORS for production domain
- Use HTTPS in production

## Support & Documentation

For detailed information about specific features, refer to the inline code comments and TypeScript interfaces.

## License

Proprietary - Aicee-Tech Medical Records Management System

## Version

1.0.0 - Initial Release
