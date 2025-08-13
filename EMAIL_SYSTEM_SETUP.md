# 📧 Email System Setup Guide

## 🚨 **Current Issue: Email Not Working**

The email system is not working because the **email password is not configured** in Railway. Here's how to fix it:

## 🔧 **Step 1: Configure Email Password in Railway**

### **For Hotmail/Outlook (Current Setup):**
1. **Go to Railway Dashboard** - https://railway.app/
2. **Select your backend project**
3. **Go to "Variables" tab**
4. **Add this environment variable:**
   ```
   MAIL_PASSWORD=your_hotmail_password_here
   ```

### **For Gmail (Alternative):**
If you prefer Gmail, update these variables:
```
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
```

And update `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
```

## 🔐 **Step 2: Get Email Password**

### **For Hotmail/Outlook:**
1. **Go to** https://account.live.com/proofs/AppPassword
2. **Sign in** with `rilindi-shpk@hotmail.com`
3. **Generate App Password** for "Mail"
4. **Copy the password** (16 characters)
5. **Add to Railway** as `MAIL_PASSWORD`

### **For Gmail:**
1. **Go to** https://myaccount.google.com/apppasswords
2. **Sign in** with your Gmail
3. **Generate App Password** for "Mail"
4. **Copy the password** (16 characters)
5. **Add to Railway** as `MAIL_PASSWORD`

## 🧪 **Step 3: Test Email System**

### **Option 1: Test via API (After Setup)**
```bash
curl -X POST "https://agencyproject-production-dbfc.up.railway.app/bookings/test-email?email=keogaci@gmail.com"
```

### **Option 2: Test via Booking**
1. **Go to your website**
2. **Book the €0.01 test tour**
3. **Use your email: keogaci@gmail.com**
4. **Check your inbox**

## 📋 **Step 4: Verify Email Configuration**

### **Current Email Settings:**
- **Host:** smtp-mail.outlook.com
- **Port:** 587
- **Username:** rilindi-shpk@hotmail.com
- **Password:** [NOT CONFIGURED - NEEDS TO BE SET]

### **Required Railway Variables:**
```
MAIL_USERNAME=rilindi-shpk@hotmail.com
MAIL_PASSWORD=[YOUR_HOTMAIL_APP_PASSWORD]
```

## 🎯 **Step 5: Beautiful Email Features**

Once configured, you'll get:

### **Customer Email Features:**
- ✅ **Professional HTML design**
- ✅ **Invoice-like appearance**
- ✅ **Booking ID prominently displayed**
- ✅ **Trip details in organized sections**
- ✅ **Payment breakdown**
- ✅ **Contact information**
- ✅ **Next steps guidance**
- ✅ **Mobile-responsive design**

### **Agency Email Features:**
- ✅ **Professional notification design**
- ✅ **Customer information**
- ✅ **Trip details**
- ✅ **Payment summary**
- ✅ **Action buttons for reply/call**
- ✅ **Revenue tracking**

## 🚨 **Why Emails Aren't Working Now:**

1. **Missing Password** - `MAIL_PASSWORD` not set in Railway
2. **Authentication Failed** - Can't connect to email server
3. **System Graceful** - Booking still works, emails just fail silently

## ✅ **After Setup:**

1. **Deploy changes** to Railway
2. **Test with €0.01 booking**
3. **Check both customer and agency emails**
4. **Verify beautiful HTML design**

## 📞 **Need Help?**

- **Hotmail App Password:** https://account.live.com/proofs/AppPassword
- **Gmail App Password:** https://myaccount.google.com/apppasswords
- **Railway Variables:** https://railway.app/dashboard

**The email system is ready - just needs the password configured!** 🚀


