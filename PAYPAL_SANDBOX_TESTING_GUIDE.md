# PayPal Sandbox Testing Guide

## 🚨 **Current Issue**
- PayPal is asking for SMS verification code
- Code is not being sent (normal in sandbox)
- Payment flow is blocked

## 🛠️ **Solution: Use Sandbox Test Accounts**

### **Method 1: PayPal Sandbox Account (No SMS Needed)**

#### **Step 1: Use Sandbox Buyer Account**
```
Email: sb-buyer@business.example.com
Password: test123
```

#### **Step 2: Testing Flow**
1. Click "Pay with PayPal" button
2. Login with sandbox credentials above
3. Complete payment without SMS verification
4. Payment will be processed in sandbox

### **Method 2: PayPal Sandbox Cards (Alternative)**

#### **Test Card Details**
```
Card Number: 4032030000000002 (Visa)
Expiry Date: 12/25 (any future date)
CVV: 123 (any 3 digits)
Name: Test User
```

#### **Testing Flow**
1. Click "Pay with Card" option
2. Enter sandbox card details above
3. Complete payment
4. No SMS verification needed

## 🔧 **Environment Setup Verification**

### **1. Check PayPal Configuration**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-config"
```

Expected response:
```json
{
  "baseUrl": "https://api-m.sandbox.paypal.com",
  "clientIdSet": true,
  "clientSecretSet": true
}
```

### **2. Test PayPal API**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-test"
```

Expected response:
```json
{
  "status": "success",
  "message": "PayPal API is accessible"
}
```

### **3. Test Order Creation**
```bash
curl -X POST "https://agencyproject-production-dbfc.up.railway.app/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"cart":[{"id":"test_1","quantity":1,"price":10.00,"title":"Test Tour"}]}'
```

Expected response:
```json
{
  "id": "EC-1234567890123456"
}
```

## 📋 **Step-by-Step Testing**

### **1. Prepare Test Environment**
- Ensure you're using sandbox credentials
- Verify PayPal API is accessible
- Use sandbox test accounts

### **2. Test Payment Flow**
1. **Navigate to booking page**
2. **Fill booking details**
3. **Click "Proceed to Payment"**
4. **Choose "Pay with PayPal"**
5. **Login with sandbox account:**
   - Email: `sb-buyer@business.example.com`
   - Password: `test123`
6. **Complete payment** (no SMS needed)

### **3. Verify Success**
- Payment should complete without SMS verification
- Order should be captured successfully
- Confirmation email should be sent

## 🎯 **Expected Results**

### **Successful Test:**
- ✅ No SMS verification required
- ✅ Payment completes in sandbox
- ✅ Order captured successfully
- ✅ Confirmation email sent
- ✅ No compliance violations

### **If Still Having Issues:**
- Check PayPal credentials in Railway
- Verify sandbox environment is active
- Use sandbox test accounts only

## 🔍 **Troubleshooting**

### **SMS Verification Still Appears:**
1. **Close PayPal popup**
2. **Clear browser cache**
3. **Try again with sandbox account**
4. **Look for "Skip verification" option**

### **Payment Fails:**
1. **Check PayPal API connectivity**
2. **Verify sandbox credentials**
3. **Use sandbox test accounts**
4. **Check Railway logs for errors**

### **Order Creation Fails:**
1. **Verify environment variables**
2. **Check PayPal API status**
3. **Test with smaller amounts**
4. **Review backend logs**

## 📞 **Support**

### **If Issues Persist:**
1. Check Railway environment variables
2. Verify PayPal developer account status
3. Use sandbox test accounts only
4. Contact support with error details

---

**Note**: In sandbox mode, SMS verification is simulated and codes are not sent. Use sandbox test accounts to avoid this issue.
