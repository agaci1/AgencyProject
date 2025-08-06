# 🚀 Deploy Your Travel Agency to RILINDISHPK.COM

## ✅ **Your Application is Ready for Deployment!**

Your frontend builds successfully and your PayPal integration is configured. Now let's deploy to your domain.

## 🎯 **Quick Deployment Options**

### **Option 1: Cloudflare Pages (Recommended)**

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Click "Pages"** in the left sidebar
3. **Click "Create a project"**
4. **Connect your GitHub repository** (if not already connected)
5. **Configure the build**:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `agency.frontend`
6. **Set environment variables**:
   - `NEXT_PUBLIC_API_BASE`: `https://your-backend-url.com` (we'll update this)
   - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`: `AZiaAPXJQxzMqKGYAS49_T2fu-ihY700KivI-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U`
   - `NEXT_PUBLIC_PAYPAL_CURRENCY`: `EUR`
7. **Deploy!**

### **Option 2: Vercel (Alternative)**

1. **Go to Vercel**: https://vercel.com/
2. **Import your GitHub repository**
3. **Vercel will auto-detect Next.js**
4. **Set environment variables** (same as above)
5. **Deploy!**

## 🔧 **Backend Deployment**

### **Deploy Backend to Railway (Recommended)**

1. **Go to Railway**: https://railway.app/
2. **Connect your GitHub repository**
3. **Deploy the `agency.backend` directory**
4. **Set environment variables**:
   - `PAYPAL_CLIENT_ID`: `AZiaAPXJQxzMqKGYAS49_T2fu-ihY700KivI-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U`
   - `PAYPAL_CLIENT_SECRET`: `EPx-cw8fktbTXkysL9_vkKAXhKcDr0QJCI0Ir4VngSJbXwCVzmviLUaksRkcGHquABIthJf6B-T-3iku`
   - `MAIL_USERNAME`: `rilindi-shpk@hotmail.com`
   - `MAIL_PASSWORD`: `taxluwqrmvpcbytu`
   - `DATABASE_URL`: Railway will provide this

## 🌐 **Connect Your Domain**

### **For Cloudflare Pages:**

1. **In your Pages project settings**
2. **Click "Custom domains"**
3. **Add domain**: `rilindishpk.com`
4. **Cloudflare will handle SSL automatically**

### **For Vercel:**

1. **In your Vercel project settings**
2. **Go to "Domains"**
3. **Add domain**: `rilindishpk.com`
4. **Update nameservers if needed**

## 📋 **Deployment Checklist**

### **Before Deployment:**
- [x] Frontend builds successfully
- [x] PayPal credentials configured
- [x] Environment variables ready
- [x] Domain registered in Cloudflare

### **During Deployment:**
- [ ] Deploy backend to Railway/Render
- [ ] Get backend URL
- [ ] Update frontend environment with backend URL
- [ ] Deploy frontend to Cloudflare Pages/Vercel
- [ ] Connect custom domain

### **After Deployment:**
- [ ] Test website loads at `https://rilindishpk.com`
- [ ] Test tour booking flow
- [ ] Test PayPal payment
- [ ] Test email notifications
- [ ] Update PayPal app settings for production domain

## 🎯 **Next Steps After Deployment**

1. **Update PayPal App Settings**:
   - Go to PayPal Developer Portal
   - Add allowed origins: `https://rilindishpk.com`
   - Add return URLs: `https://rilindishpk.com/tours`

2. **Switch to Production PayPal** (when ready):
   - Create production PayPal app
   - Get production credentials
   - Update environment variables

3. **Set up monitoring**:
   - Google Analytics
   - Error tracking
   - Performance monitoring

## 🚨 **Important Notes**

- **Keep your PayPal credentials secure**
- **Never commit `.env` files to Git**
- **Test thoroughly before going live**
- **Monitor your application after deployment**

## 📞 **Need Help?**

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test locally first
4. Check domain DNS settings

Your travel agency will be live at `https://rilindishpk.com` once deployed! 🎉 