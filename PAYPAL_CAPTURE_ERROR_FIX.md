# PayPal Capture Error Fix Guide

## 🚨 **Current Issue**
- **Error**: `Failed to load resource: the server responded with a status of 500 () (capture, line 0)`
- **Message**: `{"error":"Failed to capture order"}`
- **Location**: PayPal order capture process

## 🔍 **Root Cause Analysis**

The 500 error during PayPal capture can be caused by several factors:

### 1. **Order State Issues**
- Order is not in `APPROVED` state
- Order has already been captured
- Order has expired (PayPal orders expire after 3 hours)

### 2. **PayPal API Issues**
- Invalid order ID format
- Authentication problems
- PayPal API rate limiting
- Network connectivity issues

### 3. **Configuration Issues**
- Incorrect PayPal credentials
- Wrong PayPal environment (sandbox vs production)
- Missing or invalid access tokens

## 🛠️ **Immediate Fixes Applied**

### 1. **Enhanced Error Handling**
- Added order ID validation
- Added order status checking before capture
- Improved error messages and logging
- Better HTTP status code handling

### 2. **Backend Improvements**
```java
// Added order status validation
if (!"APPROVED".equals(orderStatus)) {
    logger.error("Order is not in APPROVED state. Current status: {}", orderStatus);
    return null;
}

// Added order ID format validation
if (!orderId.matches("[A-Z0-9_-]+")) {
    logger.error("Invalid order ID format: {}", orderId);
    return null;
}
```

### 3. **Frontend Improvements**
```javascript
// Added response status checking
if (!response.ok) {
    console.error('Capture failed with status:', response.status);
    // Handle specific error cases
    if (response.status === 400) {
        throw new Error("Invalid payment order. Please try again.");
    } else if (response.status === 500) {
        throw new Error("Payment capture failed. This may be due to an expired order or PayPal API issue. Please try again.");
    }
}
```

## 🧪 **Testing Tools**

### 1. **Debug Tool**
Use the `test-paypal-capture-debug.html` file to:
- Check PayPal configuration
- Test PayPal API connectivity
- Create test orders
- Test order capture
- Identify specific error causes

### 2. **Manual Testing Steps**
```bash
# 1. Check PayPal configuration
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-config"

# 2. Test PayPal API connectivity
curl -X GET "https://agencyproject-production-dbfc.up.railway.app/api/paypal-test"

# 3. Create a test order
curl -X POST "https://agencyproject-production-dbfc.up.railway.app/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"cart":[{"id":"test_1","quantity":1,"price":100.00,"title":"Test Tour"}]}'

# 4. Capture the order (replace ORDER_ID with actual ID)
curl -X POST "https://agencyproject-production-dbfc.up.railway.app/api/orders/ORDER_ID/capture" \
  -H "Content-Type: application/json"
```

## 🔧 **Configuration Verification**

### 1. **Environment Variables**
Ensure these are set correctly in production:
```bash
PAYPAL_BASE_URL=https://api-m.paypal.com  # Production
PAYPAL_CLIENT_ID=your_production_client_id
PAYPAL_CLIENT_SECRET=your_production_client_secret
```

### 2. **PayPal App Configuration**
- Verify the PayPal app is configured for production
- Check that the domain is allowed in PayPal app settings
- Ensure the app has the correct permissions

## 📋 **Troubleshooting Checklist**

### ✅ **Configuration Checks**
- [ ] PayPal credentials are set correctly
- [ ] PayPal environment matches (production vs sandbox)
- [ ] Domain is allowed in PayPal app settings
- [ ] PayPal API is accessible

### ✅ **Order Flow Checks**
- [ ] Order creation succeeds
- [ ] Order ID format is valid
- [ ] Order is in APPROVED state before capture
- [ ] Order hasn't expired (created within 3 hours)

### ✅ **Network Checks**
- [ ] Backend can reach PayPal API
- [ ] Frontend can reach backend
- [ ] No firewall or proxy issues
- [ ] SSL certificates are valid

## 🚀 **Deployment Steps**

### 1. **Deploy Backend Changes**
```bash
cd agency.backend
./mvnw clean package
# Deploy to Railway or your hosting platform
```

### 2. **Deploy Frontend Changes**
```bash
cd agency.frontend
npm run build
# Deploy to your hosting platform
```

### 3. **Verify Deployment**
- Test PayPal configuration endpoint
- Test PayPal API connectivity
- Create and capture a test order
- Monitor logs for any errors

## 📊 **Monitoring and Logs**

### 1. **Backend Logs**
Monitor these log messages:
```
INFO  - PayPal order created successfully: EC-1234567890123456
INFO  - Order status: APPROVED
INFO  - PayPal order captured successfully: EC-1234567890123456
ERROR - Order is not in APPROVED state. Current status: CREATED
ERROR - Invalid order ID format: invalid-order-id
```

### 2. **Frontend Console**
Monitor these console messages:
```
PayPal order approved: {orderID: "EC-1234567890123456"}
Server capture response: {id: "EC-1234567890123456", status: "COMPLETED"}
Payment captured successfully: {purchase_units: [...]}
```

## 🔄 **Recovery Procedures**

### 1. **If Orders Are Expired**
- Orders expire after 3 hours
- Users need to create new orders
- Implement automatic order refresh

### 2. **If PayPal API Is Down**
- Implement retry logic
- Show user-friendly error messages
- Provide alternative payment methods

### 3. **If Configuration Is Wrong**
- Check environment variables
- Verify PayPal app settings
- Test with PayPal sandbox first

## 📞 **Support Information**

### **Error Codes to Report**
- `PAYPAL_UNAUTHORIZED_ORDER`: Authentication issue
- `PAYPAL_INVALID_CLIENT_ID`: Configuration issue
- `PAYPAL_ORDER_EXPIRED`: Order timeout issue
- `PAYPAL_CAPTURE_FAILED`: General capture failure

### **Debug Information to Collect**
- Order ID
- Error response from PayPal
- Backend logs
- Frontend console logs
- PayPal configuration status

## 🎯 **Expected Outcome**

After implementing these fixes:
1. ✅ Better error handling and user feedback
2. ✅ Order state validation before capture
3. ✅ Detailed logging for debugging
4. ✅ Graceful handling of expired orders
5. ✅ Clear error messages for users

## 🔍 **Next Steps**

1. **Deploy the fixes** to production
2. **Test the payment flow** with real orders
3. **Monitor the logs** for any remaining issues
4. **Use the debug tool** to verify everything works
5. **Implement monitoring** for ongoing health checks

---

**Note**: This guide addresses the immediate PayPal capture error. For long-term stability, consider implementing:
- Order expiration handling
- Retry logic for failed captures
- Real-time order status monitoring
- Automated testing for payment flows
