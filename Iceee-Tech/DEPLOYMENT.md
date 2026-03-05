# Aicee-Tech Deployment Guide

Complete guide for deploying the Aicee-Tech Medical Records Management System to production.

## Pre-Deployment Checklist

- [ ] Update JWT_SECRET in backend config
- [ ] Configure SMTP email settings
- [ ] Set up MySQL database
- [ ] Create admin account
- [ ] Test authentication flows
- [ ] Verify email notifications
- [ ] Test PDF export functionality
- [ ] Check light/dark theme switching
- [ ] Verify responsive design on mobile
- [ ] Test all user approval workflows
- [ ] Confirm audit logging works
- [ ] Security review of API endpoints

## Frontend Deployment (Vercel)

### Option 1: Deploy from GitHub

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```
4. Deploy automatically on push

### Option 2: Deploy Manually

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy to your hosting:
   ```bash
   pnpm deploy
   ```

### Production Environment Variables

Create `.env.production`:
```
NEXT_PUBLIC_API_URL=https://api.aicee-tech.com
```

## Backend Deployment (PHP)

### Requirements
- PHP 8.0 or higher
- MySQL 8.0 or higher
- OpenSSL extension
- cURL extension

### Hosting Platforms

#### Option 1: Traditional Web Hosting

1. Upload PHP files via FTP to your hosting provider
2. Create MySQL database
3. Import database schema:
   ```sql
   mysql -u username -p database_name < database.sql
   ```
4. Create `.env` file with production settings
5. Update file permissions (755 for directories, 644 for files)
6. Enable SSL/HTTPS

#### Option 2: AWS/DigitalOcean/Linode

1. Set up Ubuntu 20.04+ server
2. Install PHP and MySQL:
   ```bash
   sudo apt update
   sudo apt install php php-mysql php-mbstring php-curl
   sudo apt install mysql-server
   ```
3. Clone your repository
4. Configure web server (Apache/Nginx)
5. Set up SSL certificate (Let's Encrypt)

#### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM php:8.0-apache
RUN docker-php-ext-install mysqli pdo pdo_mysql
COPY backend/ /var/www/html
EXPOSE 80
CMD ["apache2-foreground"]
```

Deploy:
```bash
docker build -t aicee-tech-backend .
docker run -d -p 80:80 aicee-tech-backend
```

## Production Configuration

### Backend .env Settings

```env
# Database
DB_HOST=prod-db.example.com
DB_USER=aicee_prod
DB_PASS=secure-password-here
DB_NAME=aicee_tech_prod
DB_PORT=3306

# JWT Security
JWT_SECRET=generate-long-random-string
JWT_EXPIRY=86400

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-app@gmail.com
MAIL_PASS=app-specific-password
MAIL_FROM=noreply@aicee-tech.com

# Application
APP_ENV=production
APP_URL=https://aicee-tech.com
BACKEND_URL=https://api.aicee-tech.com
```

### Frontend .env.production

```env
NEXT_PUBLIC_API_URL=https://api.aicee-tech.com
```

## Security Hardening

### PHP Configuration

Update `php.ini`:
```ini
display_errors = Off
error_reporting = E_ALL
log_errors = On
error_log = /var/log/php-errors.log
session.secure = 1
session.httponly = 1
session.samesite = Strict
```

### Web Server Configuration

#### Apache (.htaccess)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Disable directory listing
Options -Indexes

# Restrict access to sensitive files
<Files ".env">
    Deny from all
</Files>
<Files "config.php">
    Deny from all
</Files>
```

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.aicee-tech.com;

    ssl_certificate /etc/letsencrypt/live/api.aicee-tech.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aicee-tech.com/privkey.pem;

    root /var/www/api;
    index index.php;

    # Hide PHP files
    location ~ /\. {
        deny all;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # CORS Headers
    add_header Access-Control-Allow-Origin "https://aicee-tech.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
}
```

## Database Setup

### Initial Setup

```sql
-- Create database
CREATE DATABASE aicee_tech_prod CHARACTER SET utf8mb4;

-- Create admin user
USE aicee_tech_prod;
INSERT INTO users (email, password_hash, name, role, approved) 
VALUES ('admin@aicee-tech.com', '$2y$10$...', 'System Admin', 'admin', 1);
```

### Backup Strategy

Daily automated backups:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/aicee-tech"
DATE=$(date +%Y%m%d)

mysqldump -u root -p$DB_PASSWORD aicee_tech_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz
```

### Performance Optimization

Add indexes to frequently queried columns:
```sql
-- Medical Records Query
ALTER TABLE medical_records ADD INDEX idx_user_id (user_id);
ALTER TABLE medical_records ADD INDEX idx_status (status);

-- User Approvals Query  
ALTER TABLE users ADD INDEX idx_approved (approved);

-- Audit Logs
ALTER TABLE audit_logs ADD INDEX idx_user_id (user_id);
ALTER TABLE audit_logs ADD INDEX idx_created_at (created_at);
```

## Monitoring & Maintenance

### Log Files

Monitor these logs:
- `/var/log/php-errors.log` - PHP errors
- `/var/log/mysql/error.log` - Database errors
- Web server access logs

### Health Checks

Create a health check endpoint:

```php
// backend/api/health.php
<?php
header('Content-Type: application/json');

try {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($db->connect_error) throw new Exception('Database error');
    
    echo json_encode(['status' => 'healthy']);
} catch (Exception $e) {
    http_response_code(503);
    echo json_encode(['status' => 'unhealthy', 'error' => $e->getMessage()]);
}
```

Monitor with:
```bash
curl https://api.aicee-tech.com/api/health
```

## Rollback Plan

If deployment fails:

1. Revert code to previous version
2. Database migration (if applicable):
   ```bash
   git revert <commit-hash>
   ```
3. Verify all systems operational
4. Notify users if necessary

## Post-Deployment

### Verification

- [ ] Login page loads
- [ ] Registration works
- [ ] Admin approval workflow functions
- [ ] Student can submit records
- [ ] Admin can approve records
- [ ] PDF export works
- [ ] Emails send correctly
- [ ] Theme switching works
- [ ] Audit logs record actions
- [ ] All API endpoints respond

### Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 100 https://aicee-tech.com/login

# API endpoint testing
curl -X POST https://api.aicee-tech.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### SSL/TLS Certificate

Use Let's Encrypt for free SSL:
```bash
sudo certbot certonly --apache -d aicee-tech.com
sudo certbot renew --dry-run  # Test renewal
```

## Support & Troubleshooting

### Common Issues

**Database Connection Error**
- Verify credentials in .env
- Check firewall rules
- Confirm database is running

**Email Not Sending**
- Verify SMTP credentials
- Check email logs: `/var/log/mail.log`
- Test SMTP connection

**404 Errors**
- Check API endpoint paths
- Verify rewrite rules
- Clear browser cache

**Performance Issues**
- Check database indexes
- Monitor server resources
- Enable caching

## Security Checklist

- [ ] HTTPS enabled
- [ ] JWT_SECRET changed
- [ ] Database backups configured
- [ ] Firewall rules set
- [ ] Database user has limited permissions
- [ ] Sensitive files protected (.env, config.php)
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (HTML escaping)
- [ ] CSRF tokens implemented
- [ ] Password hashing with bcrypt

## Version Control

Tag releases:
```bash
git tag -a v1.0.0 -m "Production Release"
git push origin v1.0.0
```

## Support

For deployment assistance, refer to:
- SETUP.md for development setup
- PHP documentation: php.net
- MySQL documentation: dev.mysql.com
- Next.js documentation: nextjs.org
