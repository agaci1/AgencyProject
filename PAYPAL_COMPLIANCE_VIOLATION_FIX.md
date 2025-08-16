# PayPal Compliance Violation Fix Guide

## 🚨 **Current Issue**
- **Error**: 422 Unprocessable Entity
- **Issue**: `COMPLIANCE_VIOLATION`
- **Description**: "Transaction cannot be processed due to a possible compliance violation"
- **Debug ID**: `9e436dd049c54`

## 🔍 **Root Cause**
The error is caused by a **mismatch between PayPal environment and credentials**:
- **Current Setup**: Production API (`https://api-m.paypal.com`) + Sandbox Credentials
- **Result**: PayPal rejects the transaction due to compliance violation

## 🛠️ **Immediate Fix Applied**

### **1. Switched to Sandbox Environment**
```properties
# BEFORE (Production API with Sandbox credentials = COMPLIANCE_VIOLATION)
paypal.base.url=${PAYPAL_BASE_URL:https://api-m.paypal.com}

# AFTER (Sandbox API with Sandbox credentials = ✅ Works)
paypal.base.url=${PAYPAL_BASE_URL:https://api-m.sandbox.paypal.com}
```

### **2. Enhanced Error Handling**
Added specific handling for compliance violations in frontend:
```javascript
if (orderData.details && orderData.details.includes("COMPLIANCE_VIOLATION")) {
  throw new Error("Payment configuration issue. Please contact support with error: COMPLIANCE_VIOLATION");
}
```

## 🔧 **Environment Configuration Options**

### **Option 1: Use Sandbox (Recommended for Testing)**
```bash
# Set these environment variables in Railway
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
```

### **Option 2: Use Production (For Live Payments)**
```bash
# Set these environment variables in Railway
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_client_secret
```

## 📋 **Verification Steps**

### **1. Check Current Configuration**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-config"
```

### **2. Test PayPal API Connectivity**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-test"
```

### **3. Create Test Order**
```bash
curl -X POST "https://agencyproject-production-dbfc.up.railway.app/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"cart":[{"id":"test_1","quantity":1,"price":10.00,"title":"Test Tour"}]}'
```

## 🚀 **Deployment Steps**

### **1. Update Environment Variables**
In Railway dashboard, set:
```bash
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

### **2. Deploy Backend Changes**
```bash
cd agency.backend
./mvnw clean package -DskipTests
# Deploy to Railway
```

### **3. Deploy Frontend Changes**
```bash
cd agency.frontend
npm run build
# Deploy to your hosting platform
```

## 🧪 **Testing with Sandbox**

### **Sandbox Test Accounts**
- **Buyer**: `sb-buyer@business.example.com`
- **Password**: `test123`
- **Card**: 4032030000000002 (Visa)

### **Test Flow**
1. Create order with sandbox API
2. Complete payment with sandbox account
3. Verify capture works without compliance violation

## 🔄 **Production Setup (When Ready)**

### **1. Get Production Credentials**
1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Switch to "Live" environment
3. Create a new app for production
4. Get production Client ID and Secret

### **2. Update Environment Variables**
```bash
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_client_secret
```

### **3. Verify Production Setup**
- Test with small amounts first
- Monitor logs for any issues
- Ensure domain is allowed in PayPal app settings

## 📊 **Error Types & Solutions**

### **COMPLIANCE_VIOLATION**
- **Cause**: Environment/credential mismatch
- **Solution**: Use matching environment and credentials

### **ORDER_ALREADY_CAPTURED**
- **Cause**: Double capture attempt
- **Solution**: Check order status before capture

### **AUTHENTICATION_FAILED**
- **Cause**: Invalid credentials
- **Solution**: Verify Client ID and Secret

### **ORDER_NOT_FOUND**
- **Cause**: Invalid order ID or wrong environment
- **Solution**: Check order ID and environment

## 🎯 **Expected Results**

After applying the fix:
1. ✅ **No more compliance violations**
2. ✅ **Successful order creation and capture**
3. ✅ **Clear error messages for other issues**
4. ✅ **Proper sandbox testing environment**

## 🔍 **Monitoring**

### **Check Logs For:**
```
INFO  - PayPal order created successfully: EC-1234567890123456
INFO  - Order status: APPROVED
INFO  - PayPal order captured successfully: EC-1234567890123456
```

### **Watch For:**
```
ERROR - PayPal returned 422 error - unprocessable entity, likely order already captured
ERROR - PayPal error details - Name: UNPROCESSABLE_ENTITY, Message: COMPLIANCE_VIOLATION
```

## 📞 **Support Information**

### **If Issues Persist:**
1. Check PayPal Developer Dashboard for account status
2. Verify app permissions and settings
3. Contact PayPal Support with debug ID: `9e436dd049c54`
4. Check Railway logs for detailed error information

---

**Note**: This fix addresses the immediate compliance violation. For production use, ensure you have proper PayPal business account verification and use production credentials.
