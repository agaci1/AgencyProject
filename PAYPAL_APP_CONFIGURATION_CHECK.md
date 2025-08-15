# PayPal App Configuration Check - Fix "Unauthorized Order" Error

## 🚨 **Critical Issue: PayPal App Domain Authorization**

Since you already have the environment variables set, the "unauthorized order" error is most likely caused by **PayPal app configuration issues** in the PayPal Developer Dashboard.

## 🔍 **Step-by-Step PayPal App Configuration Check**

### **Step 1: Access PayPal Developer Dashboard**

1. **Go to [PayPal Developer Portal](https://developer.paypal.com/)**
2. **Sign in** with your PayPal Business account
3. **Go to "Apps & Credentials"**
4. **Select "Live"** (not Sandbox)

### **Step 2: Find Your App**

1. **Look for your app** with Client ID: `Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX`
2. **Click on the app name** to open settings

### **Step 3: Check App Settings**

#### **Required Settings:**

1. **App Name**: Should match your business name
2. **App Type**: Should be "Web" or "Web Application"
3. **Status**: Should be "Active"

#### **Critical Domain Settings:**

**Look for these sections and add your domain:**

1. **Allowed Return URLs** (CRITICAL):
   ```
   https://rilindishpk.com/tours
   https://www.rilindishpk.com/tours
   https://rilindishpk.com
   https://www.rilindishpk.com
   ```

2. **Allowed Origins** (CRITICAL):
   ```
   https://rilindishpk.com
   https://www.rilindishpk.com
   ```

3. **Web Experience Settings**:
   - **Enable Web Experience**: Yes
   - **Return URL**: `https://rilindishpk.com/tours`

### **Step 4: Check Business Account Settings**

1. **Go to PayPal Business Account** (not Developer)
2. **Profile → My Selling Tools → Website Preferences**
3. **Enable Auto Return**: `https://rilindishpk.com/tours`
4. **Enable Payment Data Transfer**

## 🚨 **Common Configuration Issues**

### **Issue 1: Domain Not Added to Allowed Origins**
**Symptoms**: "unauthorized order" error
**Fix**: Add `https://rilindishpk.com` to Allowed Origins in PayPal app

### **Issue 2: Wrong Return URL**
**Symptoms**: Payment completes but doesn't return to your site
**Fix**: Set Return URL to `https://rilindishpk.com/tours`

### **Issue 3: Using Sandbox Instead of Live**
**Symptoms**: "invalid client id" or "unauthorized order"
**Fix**: Make sure you're using Live credentials, not Sandbox

### **Issue 4: App Not Active**
**Symptoms**: Various PayPal errors
**Fix**: Ensure app status is "Active" in Developer Dashboard

## 🧪 **Test Your Configuration**

### **Use the Diagnostic Tool**

1. **Open**: `paypal-diagnostic-tool.html` in your browser
2. **Run the tests** to see exactly what's failing
3. **Look for specific error messages**

### **Manual Test**

1. **Go to your website**: https://rilindishpk.com/tours
2. **Try to make a booking**
3. **Check browser console** for specific errors
4. **Look for these error messages**:
   - "unauthorized order" → Domain authorization issue
   - "invalid client id" → Credentials issue
   - "domain not allowed" → Allowed origins issue

## 🔧 **Quick Fix Checklist**

### **PayPal Developer Dashboard:**
- [ ] App is in "Live" mode (not Sandbox)
- [ ] App status is "Active"
- [ ] `https://rilindishpk.com` added to Allowed Origins
- [ ] `https://rilindishpk.com/tours` added to Return URLs
- [ ] `https://www.rilindishpk.com` also added (if using www)

### **PayPal Business Account:**
- [ ] Auto Return enabled: `https://rilindishpk.com/tours`
- [ ] Payment Data Transfer enabled
- [ ] Account is verified and active

### **Railway Environment Variables:**
- [ ] `NEXT_PUBLIC_PAYPAL_CLIENT_ID` set correctly
- [ ] `PAYPAL_CLIENT_ID` set correctly (backend)
- [ ] `PAYPAL_CLIENT_SECRET` set correctly (backend)

## 🎯 **Most Likely Solution**

Based on the "unauthorized order" error, you need to:

1. **Go to PayPal Developer Dashboard**
2. **Find your Live app**
3. **Add `https://rilindishpk.com` to "Allowed Origins"**
4. **Add `https://rilindishpk.com/tours` to "Return URLs"**
5. **Save the changes**
6. **Wait 5-10 minutes** for changes to propagate
7. **Test again**

## 📞 **If Still Not Working**

### **Contact PayPal Support:**

1. **PayPal Developer Support**: [developer.paypal.com/support](https://developer.paypal.com/support)
2. **Provide them with**:
   - Your Client ID (first few characters)
   - Your domain: `rilindishpk.com`
   - Error message: "unauthorized order"
   - Steps to reproduce

### **Alternative Test:**

1. **Temporarily change domain** to `http://localhost:3000` for testing
2. **Test locally** to see if it works
3. **If it works locally**, the issue is definitely domain authorization
4. **If it doesn't work locally**, the issue is credentials

## ✅ **Success Indicators**

After fixing the configuration:

- ✅ PayPal button appears without errors
- ✅ Order creation succeeds
- ✅ Payment processing works
- ✅ Real money transfers occur
- ✅ No "unauthorized order" errors

---

**The "unauthorized order" error is almost always a domain authorization issue in PayPal Developer Dashboard. Check your app settings first!**
