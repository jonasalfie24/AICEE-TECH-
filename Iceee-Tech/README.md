# Aicee-Tech Medical Records Management System

A professional, full-featured medical records management platform built for educational institutions. This system allows students to submit and manage medical records while providing administrators with powerful tools for approval workflows and system management.

## Key Features

### Student Features
- **Secure Registration**: Students self-register and await admin approval
- **Medical Record Submission**: Submit records with strand, section, student name, medical condition, and date
- **Record Management**: View, edit (before submission), and delete draft records
- **PDF Export**: Download approved records as professional PDF documents
- **Profile Management**: Update personal information and change password
- **Theme Preference**: Switch between light and dark modes
- **Record Status Tracking**: Monitor record approval status in real-time

### Administrator Features
- **User Approval Dashboard**: Review and approve/reject pending student accounts
- **Medical Records Management**: Review all submitted medical records with filtering
- **Record Approval Workflow**: Approve or reject submitted records with notifications
- **Dashboard Analytics**: View system statistics and key metrics
- **Audit Logging**: Complete activity tracking for compliance and security
- **Account Settings**: Manage admin profile and password
- **System Monitoring**: Track system health and performance metrics

### Technical Features
- **Professional UI Design**: Healthcare-focused color scheme (Purple/Blue)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Light/Dark Mode**: Accessibility support for different lighting preferences
- **JWT Authentication**: Secure token-based authentication
- **Account Approval System**: Admin review before access
- **Audit Trail**: Complete logging of all system actions
- **Email Notifications**: Automatic notifications for approvals and rejections
- **PDF Generation**: Professional document export
- **Accessibility**: WCAG compliant with proper semantic HTML

## File Structure

```
aicee-tech/
├── app/                           # Next.js 16 application
│   ├── dashboard/                 # Student dashboard
│   │   ├── page.tsx              # Main dashboard
│   │   ├── submit/               # Submit medical records
│   │   ├── records/              # View/manage records
│   │   └── settings/             # Student settings
│   ├── admin/                     # Admin interface
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── approvals/            # User approval management
│   │   ├── records/              # Medical records management
│   │   ├── audit/                # Audit log viewer
│   │   └── settings/             # Admin settings
│   ├── login/                     # Login page
│   ├── signup/                    # Registration page
│   ├── pending-approval/          # Pending approval page
│   ├── page.tsx                   # Home/redirect page
│   ├── layout.tsx                 # Root layout with providers
│   └── globals.css                # Global styles & design tokens
│
├── components/                    # React components
│   ├── StudentSidebar.tsx         # Student navigation sidebar
│   ├── StudentHeader.tsx          # Student header with theme
│   ├── AdminSidebar.tsx           # Admin navigation sidebar
│   ├── AdminHeader.tsx            # Admin header
│   ├── ProtectedRoute.tsx         # Route protection HOC
│   └── ui/                        # Shadcn UI components
│
├── context/                       # React context providers
│   ├── AuthContext.tsx            # Authentication state
│   ├── ThemeContext.tsx           # Theme (light/dark) state
│
├── lib/                          # Utilities
│   ├── api.ts                    # API configuration & helpers
│   └── utils.ts                  # Common utilities
│
├── backend/                      # PHP backend
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login.php
│   │   │   ├── signup.php
│   │   │   └── me.php
│   │   ├── users/               # User management
│   │   │   ├── profile.php
│   │   │   ├── change-password.php
│   │   │   ├── approve.php
│   │   │   └── reject.php
│   │   ├── medical-records/     # Medical records endpoints
│   │   │   ├── index.php
│   │   │   └── export.php
│   │   └── admin/               # Admin operations
│   │       ├── dashboard.php
│   │       ├── pending-users.php
│   │       ├── medical-records.php
│   │       ├── records-approve.php
│   │       └── audit-log.php
│   ├── templates/               # Email templates
│   ├── config.php               # Configuration
│   ├── Database.php             # Database class
│   ├── JWT.php                  # JWT handling
│   ├── Middleware.php           # Auth middleware
│   ├── Email.php                # Email sending
│   ├── PDFExport.php            # PDF generation
│   └── database.sql             # Database schema
│
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind configuration
├── next.config.mjs              # Next.js configuration
├── SETUP.md                     # Development setup guide
├── DEPLOYMENT.md                # Production deployment guide
└── README.md                    # This file
```

## Color System

**Healthcare-Focused Professional Design**
- **Primary**: Medical Purple (#7647b5) - Trust and professionalism
- **Secondary**: Clinical Blue (#5c9cd1) - Calm and reliability
- **Accent**: Healing Teal (#68a9b8) - Health and wellness
- **Neutrals**: White, grays, and black - Clean and professional

## Database Schema

### Users
Stores student and admin accounts with approval status

### Medical Records
Stores submitted medical records with status tracking (draft/submitted/approved/rejected)

### Audit Logs
Complete activity tracking for compliance and security

### Notifications
System notifications for approvals and rejections

### Sessions
Token management for secure authentication

## Getting Started

### Development Setup

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Configure environment**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Set up PHP backend**
   - Create MySQL database
   - Import `backend/database.sql`
   - Configure `backend/.env`
   - Run PHP development server

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Test Accounts

**Student**
- Email: student@test.com
- Password: password123

**Admin**
- Email: admin@test.com
- Password: password123

## Features in Detail

### Authentication Flow
1. User registers with email, name, strand, and section
2. Account created with `approved=false`
3. Admin reviews pending accounts
4. Admin approves or rejects
5. User receives email notification
6. Approved users can access dashboard

### Medical Record Workflow
1. Student creates medical record (status: draft)
2. Student can edit or submit record
3. Submitted records (status: submitted) go to admin
4. Admin reviews and approves or rejects
5. Student receives notification of decision
6. Approved records can be exported as PDF

### Admin Dashboard
- View key metrics (total students, pending approvals, total records)
- Manage user approvals with email notifications
- Review all medical records with filtering
- Access complete audit log
- Manage own account settings

## API Endpoints

### Authentication (15 endpoints total)
- POST /api/auth/login
- POST /api/auth/signup
- GET /api/auth/me
- POST /api/auth/logout

### Medical Records
- GET /api/medical-records (filtered by user or admin)
- POST /api/medical-records
- PUT /api/medical-records/{id}
- GET /api/medical-records/{id}/export

### User Management
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/change-password
- POST /api/users/{id}/approve (admin)
- POST /api/users/{id}/reject (admin)

### Admin Operations
- GET /api/admin/dashboard
- GET /api/admin/pending-users
- GET /api/admin/medical-records
- POST /api/admin/records/{id}/approve
- POST /api/admin/records/{id}/reject
- GET /api/admin/audit-log

## Security

- **Password Hashing**: bcrypt with salt
- **Authentication**: JWT tokens (24-hour expiry)
- **Authorization**: Role-based access control
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: HTML escaping and sanitization
- **CORS**: Configured for specific origins
- **Audit Logging**: All actions tracked with IP addresses
- **Account Approval**: Required before access

## Deployment

### Frontend
Deploy to Vercel with `NEXT_PUBLIC_API_URL` environment variable.

### Backend
Deploy PHP application to hosting with MySQL database.

See `DEPLOYMENT.md` for detailed instructions.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance

- Optimized images and assets
- CSS-in-JS with Tailwind CSS
- Server-side rendering where beneficial
- Database query optimization with indexes
- JWT token caching
- Responsive images for mobile

## Accessibility

- Semantic HTML5
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader friendly
- Mobile accessible

## Support & Documentation

- **Setup**: See `SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Code**: Extensive inline comments in all files
- **Types**: TypeScript for type safety

## Future Enhancements

- Two-factor authentication
- Email verification
- Advanced analytics
- Bulk operations
- Document uploads
- Mobile native app
- Integration with school systems
- Advanced search and filters
- Automated reminders

## License

Proprietary - Aicee-Tech Medical Records Management System

## Version

1.0.0 - Production Ready

---

**Built with React 19, Next.js 16, TypeScript, Tailwind CSS, PHP, and MySQL**

Created by v0 for professional medical records management in educational institutions.
