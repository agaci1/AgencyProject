# Railway Environment Variables Setup Guide

## 🚨 **CRITICAL: Fix PayPal "Unauthorized Order" Error**

The "unauthorized order" error occurs because the PayPal authentication method needs to be corrected. Based on PayPal's official patterns, we need to use **Client ID/Secret authentication**, not API signature.

## 🔧 **Required Railway Environment Variables**

### **Frontend Variables (Railway Frontend Service)**

You need to add these environment variables to your **Railway Frontend service**:

```bash
# PayPal Configuration (REQUIRED - This is missing!)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

### **Backend Variables (Railway Backend Service)**

**REMOVE these API signature variables** (they're not needed):
```bash
# ❌ REMOVE these - they're for API signature method
PAYPAL_API_USERNAME=rilindishpk1_api1.gmail.com
PAYPAL_API_PASSWORD=3GQE66V5Q4BEJ5UT
PAYPAL_API_SIGNATURE=A31fFfXfoxG9kgdtT-o.xQAQ7OWgAKtiGap7.Pzf3OUT0114cvPCPM3-
```

**KEEP these Client ID/Secret variables** (this is the correct method):
```bash
# ✅ KEEP these - this is the correct authentication method
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX
PAYPAL_CLIENT_SECRET=your_actual_client_secret_here
```

**Other required variables:**
```bash
# Email Configuration
MAIL_USERNAME=rilindishpk1@gmail.com
MAIL_PASSWORD=your_email_app_password_here

# Database Configuration
DATABASE_URL=your_railway_mysql_url
DATABASE_USERNAME=your_railway_mysql_username
DB_PASSWORD=your_railway_mysql_password
```

## 📋 **Step-by-Step Setup Instructions**

### **Step 1: Get Your Client Secret**

1. **Go to PayPal Developer Dashboard**
2. **Click on your app** (the third one with `Abnz_dlwA50AWSeKzCk-0...`)
3. **Click the eye icon** next to "Secret key 1" to reveal it
4. **Copy the secret key**

### **Step 2: Update Railway Variables**

1. **Go to Railway Dashboard**
2. **Select your Backend service** (agency.backend)
3. **Go to Variables tab**
4. **Remove the API signature variables**:
   - Delete `PAYPAL_API_USERNAME`
   - Delete `PAYPAL_API_PASSWORD`
   - Delete `PAYPAL_API_SIGNATURE`
5. **Update the Client Secret**:
   - Set `PAYPAL_CLIENT_SECRET` to your actual secret key

### **Step 3: Add Frontend Variables**

1. **Go to Railway Dashboard**
2. **Select your Frontend service** (agency.frontend)
3. **Go to Variables tab**
4. **Add these variables**:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX
   NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
   ```

### **Step 4: Redeploy Services**

After updating the variables:

1. **Redeploy Backend service**
2. **Redeploy Frontend service**
3. **Wait for deployment to complete**

## 🧪 **Testing the Fix**

### **Expected Behavior After Fix:**

1. **PayPal Button Appears**: No more "payment system not configured" errors
2. **Successful Order Creation**: PayPal accepts the order
3. **Real Payment Processing**: Money actually transfers between accounts
4. **Booking Confirmation**: Real transaction IDs in booking confirmations

### **Console Logs to Watch For:**

```
✅ "PayPal Client ID check: {hasClientId: true, clientIdLength: 108, ...}"
✅ "PayPal SDK script loaded successfully"
✅ "PayPal SDK initialized successfully"
✅ "Creating PayPal order for amount: X.XX"
✅ "Order approved: {orderID: '...'}"
✅ "Payment captured successfully: {...}"
✅ "Successfully obtained PayPal access token"
```

## 🚨 **Why This Fixes It**

The "unauthorized order" error was happening because:

1. **Wrong authentication method**: You were using API signature, but your app is configured for Client ID/Secret
2. **Missing frontend environment variables**: The frontend couldn't load PayPal SDK properly
3. **Mismatched credentials**: Backend and frontend were using different authentication methods

## ✅ **Success Indicators**

After implementing the fix, you should see:

- ✅ PayPal button appears on payment page
- ✅ No "unauthorized order" errors
- ✅ Successful payment processing
- ✅ Real money transfers between PayPal accounts
- ✅ Booking confirmations with real transaction IDs
- ✅ Email confirmations with valid payment details

## 📞 **Support Information**

If you need help:

1. **Check browser console** for specific error messages
2. **Note the error code** (PAYPAL_CONFIG_MISSING, etc.)
3. **Contact support** with the error code and console logs

## 🎯 **Key Changes Made**

1. **Removed API signature variables** (not needed)
2. **Updated backend code** to use Client ID/Secret authentication
3. **Added frontend environment variables** for PayPal SDK
4. **Followed PayPal's official patterns** from their toolkit

---

**This fix addresses the core authentication issue causing the "unauthorized order" error!**
