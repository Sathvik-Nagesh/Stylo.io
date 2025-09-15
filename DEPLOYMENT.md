# Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn
- Git

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/stylo-wardrobe

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# CORS Configuration
FRONTEND_URL=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX_REQUESTS=5
```

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
```

## Local Development

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Sathvik-Nagesh/Stylo.io.git
cd Stylo.io

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Start MongoDB

```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Start Development Servers

```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Production Deployment

### 1. Build the Application

```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

### 2. Database Setup

Ensure MongoDB is running and accessible:

```bash
# Create database user
mongo
use stylo-wardrobe
db.createUser({
  user: "stylo-user",
  pwd: "secure-password",
  roles: ["readWrite"]
})
```

### 3. Server Configuration

#### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'stylo-backend',
    script: './server/dist/index.js',
    cwd: './',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Using Docker

```bash
# Create Dockerfile for backend
cat > server/Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
EOF

# Build and run
docker build -t stylo-backend ./server
docker run -d -p 5000:5000 --name stylo-backend stylo-backend
```

### 4. Web Server Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend
    location / {
        root /path/to/stylo-frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Certificate

```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules
- [ ] Set up database authentication
- [ ] Enable MongoDB authentication
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Configure file upload restrictions
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup strategy implemented

## Monitoring and Maintenance

### Health Checks

```bash
# Backend health check
curl https://yourdomain.com/api/health

# Expected response
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### Logs

```bash
# PM2 logs
pm2 logs stylo-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Updates

```bash
# Update dependencies
npm audit fix
npm update

# Restart services
pm2 restart stylo-backend
sudo systemctl reload nginx
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS configuration in backend
2. **Database Connection**: Verify MongoDB is running and accessible
3. **File Upload Issues**: Check file size limits and permissions
4. **Authentication Errors**: Verify JWT secret configuration
5. **Build Errors**: Check Node.js version compatibility

### Performance Optimization

1. **Enable Gzip Compression**: Already configured in backend
2. **Database Indexing**: Indexes are pre-configured
3. **CDN**: Use CDN for static assets
4. **Caching**: Implement Redis for session storage
5. **Load Balancing**: Use multiple backend instances

## Backup Strategy

```bash
# Database backup
mongodump --db stylo-wardrobe --out /backup/$(date +%Y%m%d)

# Application backup
tar -czf stylo-backup-$(date +%Y%m%d).tar.gz /path/to/stylo-app
```

## Support

For deployment issues:
- Check logs for error messages
- Verify environment variables
- Ensure all services are running
- Check network connectivity
- Review security configurations
