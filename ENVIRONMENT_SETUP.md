# Environment Setup Guide

## 🔧 **Production Environment Variables**

### **Required Environment Variables:**

```bash
# Database Configuration
DB_PASSWORD=your_secure_database_password

# Email Configuration  
MAIL_USERNAME=your_email@domain.com
MAIL_PASSWORD=your_email_app_password

# CORS Configuration (Production)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# PayPal Configuration (Add when available)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_BASE_URL=https://api-m.paypal.com
```

### **Frontend Environment Variables:**

Create `.env.local` in `agency.frontend/`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE=https://your-backend-domain.com

# PayPal Configuration (Add when available)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

## 🚀 **Deployment Steps**

### **1. Backend Deployment**

1. **Set Environment Variables:**
   ```bash
   export DB_PASSWORD="your_secure_password"
   export MAIL_USERNAME="your_email@domain.com"
   export MAIL_PASSWORD="your_email_app_password"
   export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
   ```

2. **Build and Deploy:**
   ```bash
   cd agency.backend/backend
   ./mvnw clean package
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

### **2. Frontend Deployment**

1. **Set Environment Variables:**
   ```bash
   export NEXT_PUBLIC_API_BASE="https://your-backend-domain.com"
   ```

2. **Build and Deploy:**
   ```bash
   cd agency.frontend
   npm run build
   npm start
   ```

## 🔒 **Security Checklist**

### ✅ **Completed:**
- [x] Moved passwords to environment variables
- [x] Added input sanitization
- [x] Added request logging
- [x] Improved CORS configuration
- [x] Fixed email configuration
- [x] Added validation for guest count
- [x] Added date validation
- [x] Removed hardcoded credentials

### ⚠️ **Still Needed:**
- [ ] PayPal credentials (from owner)
- [ ] SSL certificate for HTTPS
- [ ] Rate limiting implementation
- [ ] Database backup strategy
- [ ] Monitoring and alerting

## 📋 **Production Configuration**

### **Database Security:**
- Use strong, unique passwords
- Enable SSL connections
- Regular backups
- Access logging

### **Email Security:**
- Use app-specific passwords
- Enable 2FA on email account
- Monitor for suspicious activity

### **Application Security:**
- HTTPS only in production
- Restrict CORS to specific domains
- Implement rate limiting
- Regular security updates

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Email Not Sending:**
   - Check MAIL_USERNAME and MAIL_PASSWORD
   - Verify SMTP settings
   - Check firewall/network restrictions

2. **Database Connection Failed:**
   - Verify DB_PASSWORD
   - Check database server status
   - Verify network connectivity

3. **CORS Errors:**
   - Update CORS_ALLOWED_ORIGINS
   - Ensure frontend URL is included
   - Check for typos in domain names

4. **PayPal Integration:**
   - Verify PayPal credentials
   - Check PayPal app configuration
   - Ensure correct environment (sandbox/production)

## 📞 **Support**

For deployment issues:
1. Check environment variables are set correctly
2. Verify all services are running
3. Check application logs for errors
4. Ensure network connectivity between services 