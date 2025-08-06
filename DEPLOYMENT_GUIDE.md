# Deployment Guide for RILINDISHPK.COM

## 🎯 **Your Domain: RILINDISHPK.COM**

You've successfully registered your domain in Cloudflare. Now let's deploy your travel agency application.

## 🚀 **Deployment Options**

### **Option 1: Cloudflare Pages (Recommended)**

#### **Frontend Deployment (Next.js)**

1. **Prepare your frontend for production**:
   ```bash
   cd agency.frontend
   npm run build
   ```

2. **Deploy to Cloudflare Pages**:
   - Go to Cloudflare Dashboard
   - Click "Pages" in the sidebar
   - Click "Create a project"
   - Connect your GitHub repository
   - Set build settings:
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Build output directory: `.next`
     - Root directory: `agency.frontend`

3. **Configure environment variables**:
   - `NEXT_PUBLIC_API_BASE`: Your backend URL
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: Your PayPal Client ID
   - `NEXT_PUBLIC_PAYPAL_CURRENCY`: EUR

#### **Backend Deployment**

**Option A: Railway (Recommended for backend)**
1. Go to [Railway.app](https://railway.app/)
2. Connect your GitHub repository
3. Deploy the `agency.backend` directory
4. Set environment variables:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`
   - `DATABASE_URL` (Railway provides this)

**Option B: Render**
1. Go to [Render.com](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `./mvnw clean install`
5. Set start command: `./mvnw spring-boot:run`

### **Option 2: Vercel (Full Stack)**

1. **Deploy to Vercel**:
   - Go to [Vercel.com](https://vercel.com/)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Configure environment variables

2. **Backend API Routes**:
   - Move your Spring Boot API to Vercel API routes
   - Or deploy backend separately

## 🔧 **Production Configuration**

### **Frontend Production Settings**

Update your frontend environment for production:

```bash
# .env.production
NEXT_PUBLIC_API_BASE=https://your-backend-url.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZiaAPXJQxzMqKGYAS49_T2fu-ihY700KivI-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

### **Backend Production Settings**

Update your backend for production:

```properties
# application-prod.properties
spring.profiles.active=prod
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}

# PayPal Production
paypal.base.url=https://api-m.paypal.com
paypal.client.id=${PAYPAL_CLIENT_ID}
paypal.client.secret=${PAYPAL_CLIENT_SECRET}

# CORS for production
spring.web.cors.allowed-origins=https://rilindishpk.com,https://www.rilindishpk.com
```

### **PayPal Production Setup**

1. **Switch to Production PayPal**:
   - Go to PayPal Developer Portal
   - Create a production app
   - Get production Client ID and Secret
   - Update your environment variables

2. **Configure PayPal App**:
   - Add allowed origins: `https://rilindishpk.com`
   - Add return URLs: `https://rilindishpk.com/tours`

## 🌐 **Domain Configuration**

### **Cloudflare DNS Settings**

1. **Add DNS Records**:
   - Type: A
   - Name: @
   - Content: Your server IP (if using VPS)
   - Or use CNAME for Cloudflare Pages

2. **SSL/TLS Settings**:
   - Set to "Full" or "Full (strict)"
   - Enable "Always Use HTTPS"

3. **Page Rules** (if needed):
   - Redirect www to non-www
   - Force HTTPS

### **Custom Domain Setup**

1. **For Cloudflare Pages**:
   - In your Pages project settings
   - Add custom domain: `rilindishpk.com`
   - Cloudflare will handle SSL automatically

2. **For Vercel**:
   - In your Vercel project settings
   - Add domain: `rilindishpk.com`
   - Update nameservers if needed

## 📋 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Test application locally
- [ ] Update environment variables for production
- [ ] Switch PayPal to production mode
- [ ] Update CORS settings
- [ ] Test payment flow with production PayPal

### **Deployment**
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Cloudflare Pages/Vercel
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test all functionality

### **Post-Deployment**
- [ ] Test booking flow
- [ ] Test PayPal payments
- [ ] Test email notifications
- [ ] Monitor application logs
- [ ] Set up monitoring/analytics

## 🔒 **Security Considerations**

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Restrict to your domain only
4. **Database**: Use production database (not H2)
5. **PayPal**: Use production PayPal credentials

## 📞 **Support**

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test locally first
4. Check domain DNS settings
5. Verify SSL certificate

## 🎯 **Quick Start Commands**

```bash
# Build frontend for production
cd agency.frontend
npm run build

# Test production build locally
npm start

# Deploy to Cloudflare Pages (via Git push)
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

Your application will be live at `https://rilindishpk.com` once deployed! 