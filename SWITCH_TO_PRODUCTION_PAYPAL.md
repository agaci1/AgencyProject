# Switch to Production PayPal - Simple Guide

## 🚨 **Why Switch to Production?**

The sandbox environment is causing multiple issues:
- ❌ Beacon API errors
- ❌ OAS_VALIDATION_ERROR
- ❌ Unstable test environment
- ❌ Complex credential management

**Production is much more stable and reliable!**

## 🛠️ **Step-by-Step Switch to Production**

### **Step 1: Get Production PayPal Credentials**

1. **Go to [PayPal Developer Portal](https://developer.paypal.com/)**
2. **Switch to "Live" mode** (top right corner)
3. **Go to "Apps & Credentials"**
4. **Create a new app** (if you don't have one)
5. **Copy the Client ID and Secret**

### **Step 2: Update Railway Environment Variables**

In your Railway dashboard, set these variables:
```bash
PAYPAL_BASE_URL=https://api-m.paypal.com
PAYPAL_CLIENT_ID=your_production_client_id_here
PAYPAL_CLIENT_SECRET=your_production_client_secret_here
```

### **Step 3: Update Frontend Environment**

Create a `.env.local` file in `agency.frontend/`:
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_production_client_id_here
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

### **Step 4: Deploy Changes**

```bash
# Build backend
cd agency.backend
./mvnw clean package -DskipTests

# Build frontend
cd ../agency.frontend
npm run build

# Deploy both to your hosting platforms
```

## 🎯 **Benefits of Production**

- ✅ **Stable and reliable**
- ✅ **No sandbox errors**
- ✅ **Real payment processing**
- ✅ **Professional experience**
- ✅ **No credential confusion**

## 🔧 **Testing in Production**

### **Safe Testing Methods:**

1. **Use small amounts** (€0.01 - €1.00)
2. **Test with your own cards**
3. **Monitor transactions carefully**
4. **Use PayPal's test mode within production**

### **Test Card (if needed):**
```
Card: 4032030000000002
Expiry: 12/25
CVV: 123
```

## 📋 **Verification Steps**

### **1. Check Configuration**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-config"
```

Expected:
```json
{
  "baseUrl": "https://api-m.paypal.com",
  "clientIdSet": true,
  "clientSecretSet": true
}
```

### **2. Test API Connectivity**
```bash
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-test"
```

Expected:
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
  -d '{"cart":[{"id":"test_1","quantity":1,"price":0.01,"title":"Test Tour"}]}'
```

## 🚀 **Deployment Checklist**

- [ ] Production PayPal credentials obtained
- [ ] Railway environment variables updated
- [ ] Frontend environment file created
- [ ] Backend deployed with production config
- [ ] Frontend deployed with production config
- [ ] Configuration verified
- [ ] Test payment completed successfully

## 💡 **Important Notes**

1. **Start with small amounts** for testing
2. **Monitor all transactions** carefully
3. **Keep production credentials secure**
4. **Test thoroughly before going live**

## 🎉 **Expected Result**

After switching to production:
- ✅ No more sandbox errors
- ✅ Stable payment processing
- ✅ Professional user experience
- ✅ Reliable PayPal integration

---

**Production PayPal is much more stable and will eliminate all the sandbox issues you're experiencing!**
