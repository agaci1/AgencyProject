# 🚀 Railway Deployment Guide for RILINDISHPK.COM

## ✅ **All Changes Pushed to GitHub**

Your repository is now updated with:
- ✅ PayPal integration (sandbox credentials)
- ✅ Production-ready configuration
- ✅ All new assets and images
- ✅ Deployment guides
- ✅ TypeScript fixes

## 🚂 **Deploy to Railway**

### **Step 1: Deploy Backend to Railway**

1. **Go to Railway**: https://railway.app/
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `agaci1/AgencyProject`
6. **Set Root Directory**: `agency.backend`
7. **Click "Deploy"**

### **Step 2: Configure Backend Environment Variables**

In your Railway project settings, add these environment variables:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com

# Email Configuration
MAIL_USERNAME=rilindi-shpk@hotmail.com
MAIL_PASSWORD=taxluwqrmvpcbytu

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://rilindishpk.com,https://www.rilindishpk.com

# Database (Railway will provide this automatically)
# DATABASE_URL will be set by Railway
```

### **Step 3: Deploy Frontend to Railway**

1. **In the same Railway project, click "New Service"**
2. **Select "GitHub Repo"**
3. **Choose the same repository**: `agaci1/AgencyProject`
4. **Set Root Directory**: `agency.frontend`
5. **Click "Deploy"**

### **Step 4: Configure Frontend Environment Variables**

In your frontend service settings, add:

```bash
# API Configuration (use your backend Railway URL)
NEXT_PUBLIC_API_BASE=https://your-backend-railway-url.railway.app

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

### **Step 5: Configure Custom Domain**

1. **In your frontend service settings**
2. **Go to "Settings" → "Domains"**
3. **Add custom domain**: `rilindishpk.com`
4. **Railway will provide DNS instructions**

## 🔧 **Railway-Specific Configuration**

### **Backend Service Settings**

- **Build Command**: `./mvnw clean install`
- **Start Command**: `./mvnw spring-boot:run`
- **Health Check Path**: `/health` (your DatabaseHealthController)

### **Frontend Service Settings**

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Output Directory**: `.next`

## 🌐 **Domain Configuration**

### **DNS Settings for Railway**

Railway will provide you with DNS records to add to Cloudflare:

1. **Go to Cloudflare Dashboard**
2. **Select your domain**: `rilindishpk.com`
3. **Go to DNS settings**
4. **Add the CNAME record** provided by Railway
5. **Set SSL/TLS to "Full"**

## 📋 **Deployment Checklist**

### **Before Deployment:**
- [x] All changes pushed to GitHub
- [x] PayPal credentials ready
- [x] Environment variables prepared
- [x] Domain registered in Cloudflare

### **During Deployment:**
- [ ] Deploy backend to Railway
- [ ] Set backend environment variables
- [ ] Get backend URL
- [ ] Deploy frontend to Railway
- [ ] Set frontend environment variables with backend URL
- [ ] Configure custom domain

### **After Deployment:**
- [ ] Test website loads at `https://rilindishpk.com`
- [ ] Test tour booking flow
- [ ] Test PayPal payment
- [ ] Test email notifications
- [ ] Update PayPal app settings

## 🎯 **Expected Railway URLs**

After deployment, you'll have:
- **Backend**: `https://your-backend-name.railway.app`
- **Frontend**: `https://rilindishpk.com` (custom domain)

## 🔒 **Security Notes**

- Railway automatically provides SSL certificates
- Environment variables are encrypted
- Database is automatically provisioned
- Health checks ensure service availability

## 📞 **Troubleshooting**

### **Common Issues:**

1. **Build fails**: Check build commands and dependencies
2. **Environment variables not loading**: Verify variable names and values
3. **Domain not working**: Check DNS settings in Cloudflare
4. **PayPal not working**: Verify credentials and CORS settings

### **Railway Logs:**
- Check Railway dashboard for build and runtime logs
- Monitor service health and performance
- Set up alerts for service downtime

## 🚀 **Quick Deploy Commands**

Once configured, Railway will automatically deploy on every push to main branch.

Your travel agency will be live at `https://rilindishpk.com`! 🎉 