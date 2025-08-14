# PayPal Authorization Troubleshooting Guide

## 🔍 **Since PayPal Business Account is Configured, Let's Check Other Issues**

### **1. PayPal Developer App Configuration**

**Check your PayPal Developer App settings:**

1. **Go to [PayPal Developer Portal](https://developer.paypal.com/)**
2. **Apps & Credentials → Live** (not Sandbox)
3. **Select your app**
4. **Check these settings:**

#### **Required Settings:**
- [ ] **App Name**: Should match your business
- [ ] **Client ID**: Live Client ID (not sandbox)
- [ ] **Client Secret**: Live Client Secret (not sandbox)
- [ ] **Web Experience**: Enabled
- [ ] **Return URL**: `https://rilindishpk.com/tours`

#### **Advanced Settings:**
- [ ] **Webhooks**: Not required for basic payments
- [ ] **Log in with PayPal**: Not required for payments
- [ ] **Domain Authorization**: `rilindishpk.com` should be allowed

### **2. Environment Variables Check**

**Verify Railway Environment Variables:**

```bash
# Backend Variables (Railway)
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret

# Frontend Variables (Railway)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

**Important:** Make sure you're using **LIVE** credentials, not sandbox!

### **3. PayPal App Domain Authorization**

**Check if your domain is properly authorized:**

1. **PayPal Developer Portal → Apps & Credentials → Live**
2. **Select your app**
3. **Look for "Allowed Return URLs" or "Domain Authorization"**
4. **Add**: `https://rilindishpk.com/tours`
5. **Add**: `https://rilindishpk.com` (root domain)

### **4. Test PayPal Credentials**

**Verify your credentials work:**

```bash
# Test with curl (replace with your actual credentials)
curl -X POST https://api-m.paypal.com/v1/oauth2/token \
  -H "Authorization: Basic $(echo -n 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

**Expected Response:**
```json
{
  "access_token": "A21AA...",
  "token_type": "Bearer",
  "expires_in": 32400
}
```

### **5. Browser Console Check**

**Check for JavaScript errors:**

1. **Open browser developer tools** (F12)
2. **Go to Console tab**
3. **Try to make a payment**
4. **Look for errors like:**
   - "PayPal SDK failed to load"
   - "Invalid client ID"
   - "Domain not authorized"

### **6. Network Tab Analysis**

**Check network requests:**

1. **Open browser developer tools** (F12)
2. **Go to Network tab**
3. **Try to make a payment**
4. **Look for PayPal API calls:**
   - `https://www.paypal.com/sdk/js` (SDK load)
   - `https://api-m.paypal.com/v2/checkout/orders` (order creation)
   - `https://api-m.paypal.com/v2/checkout/orders/{id}/capture` (capture)

### **7. Common Issues & Solutions**

#### **Issue: "Invalid client ID"**
**Solution:** Check if you're using live credentials, not sandbox

#### **Issue: "Domain not authorized"**
**Solution:** Add your domain to PayPal app settings

#### **Issue: "Return URL mismatch"**
**Solution:** Ensure return URL in PayPal matches your frontend

#### **Issue: "PayPal SDK not loading"**
**Solution:** Check if client ID is correct and domain is authorized

### **8. Alternative Test**

**Try with a different domain temporarily:**

1. **Change return URL** to `http://localhost:3000` for testing
2. **Test payment locally** to see if it works
3. **If it works locally**, the issue is domain authorization
4. **If it doesn't work locally**, the issue is credentials

### **9. PayPal Support Check**

**Contact PayPal if needed:**

1. **PayPal Developer Support**: [developer.paypal.com/support](https://developer.paypal.com/support)
2. **PayPal Business Support**: [paypal.com/help](https://paypal.com/help)
3. **Provide them with:**
   - Your Client ID (first few characters)
   - Your domain
   - Error messages
   - Steps to reproduce

### **10. Debug Mode**

**Enable detailed logging:**

Add this to your frontend temporarily:
```javascript
// Add to booking-form.tsx for debugging
console.log("PayPal Client ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
console.log("PayPal Currency:", process.env.NEXT_PUBLIC_PAYPAL_CURRENCY);
```

## 🎯 **Quick Diagnostic Questions**

1. **Are you using LIVE credentials** (not sandbox)?
2. **Is your domain `rilindishpk.com` added** to PayPal app settings?
3. **Are your environment variables set** in Railway?
4. **Does the PayPal button load** on your website?
5. **What specific error** do you see in browser console?

## 🚀 **Next Steps**

1. **Check PayPal Developer App settings**
2. **Verify environment variables**
3. **Test credentials with curl**
4. **Check browser console for errors**
5. **Try local testing if needed**

Let me know what you find in each step!
