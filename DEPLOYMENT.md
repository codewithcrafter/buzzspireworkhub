# BUZZSPIRE WORKHUB — Production Deployment Guide

This guide provides step-by-step procedures for deploying **BUZZSPIRE WORKHUB** to a Hostinger KVM VPS environment with Nginx reverse proxy, PM2 process management, SSL certificates (Certbot), and Neon PostgreSQL.

---

## 1. System Requirements

- **Operating System**: Ubuntu 22.04 LTS or 24.04 LTS (Hostinger KVM VPS)
- **Node.js Runtime**: Node.js 20.x LTS or 22.x LTS
- **Package Manager**: npm 10+
- **Process Manager**: PM2 (`npm install -g pm2`)
- **Web Server**: Nginx
- **Database Provider**: Neon PostgreSQL (with connection pooling)
- **SSL**: Certbot / Let's Encrypt (HTTPS)

---

## 2. Production Environment Setup

Create the production `.env` file in the project root (`/var/www/buzzspire`):

```bash
cp .env.example .env
nano .env
```

### Production Environment Variables Template:

```env
# Database Connection (Neon PostgreSQL Pooler & Direct Connection)
DATABASE_URL="postgresql://<user>:<password>@<ep-pooler-id>.neon.tech/buzzspire_db?sslmode=require"
DIRECT_URL="postgresql://<user>:<password>@<ep-direct-id>.neon.tech/buzzspire_db?sslmode=require"

# JWT Authentication Secret (Minimum 64 characters random string)
JWT_SECRET="a_very_strong_random_secret_key_generated_for_production_2026"

# Base Application HTTPS Production Domain
APP_URL="https://workhub.buzzspiremedia.com"

# Node Environment
NODE_ENV="production"

# Seed Admin Initial Password (Only required if running seed script)
ADMIN_SEED_PASSWORD="ChangeMeImmediate2026!"

# Operational Email Provider
RESEND_API_KEY="re_123456789_your_resend_api_key"
EMAIL_FROM="BuzzSpire WorkHub <notifications@buzzspiremedia.com>"
```

> [!CAUTION]
> Never commit `.env` or `.env.production` files to git. Ensure `.gitignore` includes all environment configurations.

---

## 3. Database Migration & Safety Rules

Use the safe production Prisma migration workflow. **NEVER** run `prisma migrate reset` or `prisma db push --force-reset` in production.

```bash
# Apply pending database migrations safely without data loss
npx prisma migrate deploy

# Generate latest Prisma Client code
npx prisma generate
```

---

## 4. Application Build & Process Startup

```bash
# Install dependencies
npm ci --only=production

# Compile production Next.js bundle
npm run build

# Start or restart application using PM2
pm2 start ecosystem.config.js
pm2 save
```

### PM2 Process Status Verification:

```bash
pm2 status
pm2 logs buzzspire-app
```

---

## 5. Nginx Reverse Proxy & SSL Configuration

Configure `/etc/nginx/sites-available/buzzspire.conf`:

```nginx
server {
    listen 80;
    server_name workhub.buzzspiremedia.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name workhub.buzzspiremedia.com;

    ssl_certificate /etc/letsencrypt/live/workhub.buzzspiremedia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/workhub.buzzspiremedia.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    gzip on;
    gzip_proxied any;
    gzip_comp_level 4;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    location /_next/static {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        expires 365d;
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_addrs;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable Nginx site configuration and test:

```bash
sudo ln -s /etc/nginx/sites-available/buzzspire.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Obtain Let's Encrypt SSL certificate using Certbot:

```bash
sudo certbot --nginx -d workhub.buzzspiremedia.com
```

---

## 6. Health Check Monitoring

Monitor service health at `GET /api/health`:

```bash
curl -I https://workhub.buzzspiremedia.com/api/health
```

Expected JSON response:

```json
{
  "status": "UP",
  "timestamp": "2026-09-16T10:45:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "CONNECTED",
    "latencyMs": 12
  }
}
```

---

## 7. Database Backup & Disaster Recovery Strategy

1. **Automated Neon Backups**: Neon PostgreSQL automatically performs continuous point-in-time recovery (PITR) and automated daily snapshots.
2. **Manual Pre-Deployment Dump**:
   ```bash
   pg_dump "$DIRECT_URL" -F c -b -v -f ./backups/buzzspire_$(date +%Y%m%d_%H%M%S).dump
   ```
3. **Restore Procedure**:
   ```bash
   pg_restore -d "$DIRECT_URL" --clean --if-exists ./backups/buzzspire_backup_filename.dump
   ```
4. **Rollback Consideration**: If a migration fails, revert application code to previous release build using `pm2 restart buzzspire-app`.

---

## 8. Production Security Checklist

- [x] All cookies use `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`
- [x] `Strict-Transport-Security` (HSTS) headers enabled
- [x] `X-Frame-Options: SAMEORIGIN` clickjacking protection enabled
- [x] `X-Content-Type-Options: nosniff` enabled
- [x] Formula injection protection enabled on all CSV exports
- [x] Sliding-window rate limiting enabled on authentication endpoints
- [x] Request correlation ID (`X-Request-ID`) attached to API responses
- [x] 500 error outputs sanitized with zero stack traces or secret leaks
- [x] Server-side team scope enforced to prevent IDOR attacks
