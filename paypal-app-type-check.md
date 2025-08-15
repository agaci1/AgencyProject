# PayPal App Type Verification Guide

## 🔍 **Check Your PayPal App Type**

### **Step 1: Go to PayPal Developer Dashboard**
1. Visit: https://developer.paypal.com/dashboard/applications/live
2. Click on your live app (the one with your Client ID)

### **Step 2: Check App Type**
Look for these sections in your app settings:

#### **✅ Required for Payment Processing:**
- **"Smart Payment Buttons"** - Should be enabled
- **"Orders API"** - Should be enabled  
- **"Checkout"** - Should be enabled

#### **❌ Not Required for Payments:**
- **"Log in with PayPal"** - Only needed for authentication
- **"Braintree SDK"** - Different payment system

### **Step 3: Check Business Account Type**
1. Go to your PayPal Business Account
2. Check account type:
   - **Personal Account** ❌ (Limited payment processing)
   - **Business Account** ✅ (Full payment processing)
   - **Premier Account** ✅ (Full payment processing)

### **Step 4: Check Account Verification**
1. In PayPal Business Account, check:
   - **Email verified** ✅
   - **Phone verified** ✅
   - **Bank account linked** ✅
   - **Identity verified** ✅

### **Step 5: Check Currency Settings**
1. In PayPal Business Account:
   - **EUR currency enabled** ✅
   - **Payment receiving enabled** ✅
   - **No geographic restrictions** ✅

## 🚨 **If App Type is Wrong**

If your app is configured for "Log in with PayPal" instead of "Smart Payment Buttons":

### **Option 1: Create New App**
1. Create a new app specifically for "Smart Payment Buttons"
2. Get new Client ID and Secret
3. Update Railway environment variables
4. Test with new credentials

### **Option 2: Enable Required Features**
1. In your current app, enable:
   - Smart Payment Buttons
   - Orders API
   - Checkout
2. Add domain authorization
3. Wait for approval

## 📋 **Checklist**

- [ ] App type supports Smart Payment Buttons
- [ ] Orders API is enabled
- [ ] Business account type supports payments
- [ ] Account is fully verified
- [ ] EUR currency is enabled
- [ ] No geographic restrictions
- [ ] Domain authorization configured

## 🎯 **Expected Result**

After fixing app type/features:
- ✅ Order creation works (already working)
- ✅ Payment capture works (currently failing)
- ✅ No more "unauthorized order" errors
