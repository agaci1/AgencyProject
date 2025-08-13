# PayPal Payment Troubleshooting Guide

## 🚨 **Current Issue: Payment Charged but Booking Fails**

### **Problem Description:**
- Customer gets charged €1.00 by PayPal
- SMS notification received about payment
- App shows "booking failed, payment unsuccessful"
- Owner doesn't receive the money

### **Root Cause:**
The backend PayPal credentials are not configured, causing payment validation to fail even though PayPal processes the charge.

## 🔧 **Immediate Fix**

### **Step 1: Configure PayPal Credentials**

You need to add your PayPal Client ID and Secret to the backend. The frontend already has the Client ID, but the backend needs both.

**Option A: Set Environment Variables (Recommended)**
```bash
cd agency.backend/backend
export PAYPAL_CLIENT_ID="AZiaAPXJQxzMqKGYAS49_T2fu-ihY700Kivl-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U"
export PAYPAL_CLIENT_SECRET="your_paypal_client_secret_here"
export PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
```

**Option B: Edit application.properties**
Edit `agency.backend/backend/src/main/resources/application.properties`:
```properties
paypal.client.id=AZiaAPXJQxzMqKGYAS49_T2fu-ihY700Kivl-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U
paypal.client.secret=your_paypal_client_secret_here
paypal.base.url=https://api-m.sandbox.paypal.com
```

### **Step 2: Get Your PayPal Client Secret**

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Log in to your developer account
3. Navigate to "Apps & Credentials"
4. Find your app (should have Client ID starting with "AZiaAPXJQ...")
5. Click "Show" next to Client Secret
6. Copy the Client Secret

### **Step 3: Restart the Backend**
```bash
cd agency.backend/backend
./mvnw spring-boot:run
```

## 🧪 **Testing the Fix**

### **Test with Sandbox Accounts:**
- **Buyer Email:** `sb-buyer@business.example.com`
- **Password:** (check your PayPal sandbox)

### **Expected Behavior After Fix:**
1. Customer completes PayPal payment
2. Backend validates the transaction with PayPal
3. Booking is created successfully
4. Confirmation emails are sent
5. Owner receives payment (in sandbox mode)

## 💰 **About the €1.00 Charge**

### **Why You're Being Charged:**
- **Sandbox Mode:** This is a test environment - no real money transfers
- **Authorization Hold:** PayPal may place a small hold to verify the card
- **Testing Fee:** Some sandbox transactions include small fees

### **Real Money vs Test Money:**
- **Sandbox:** All transactions are fake, no real money moves
- **Production:** Real money transfers between accounts

## 🚀 **Moving to Production**

### **When Ready for Real Payments:**

1. **Switch to Production PayPal:**
   ```bash
   export PAYPAL_BASE_URL="https://api-m.paypal.com"
   ```

2. **Update PayPal App Settings:**
   - Add your production domain to allowed origins
   - Use production Client ID and Secret

3. **Set Up Business Account:**
   - Create a PayPal Business account
   - Link your bank account
   - Verify your business information

## 🔍 **Debugging Steps**

### **Check Backend Logs:**
```bash
cd agency.backend/backend
./mvnw spring-boot:run
```
Look for these log messages:
- `"PayPal credentials not configured"` = Need to add credentials
- `"PayPal payment validated successfully"` = Working correctly
- `"PayPal transaction validation failed"` = Check credentials

### **Check Frontend Console:**
Open browser developer tools and look for:
- PayPal SDK loading errors
- Payment processing errors
- Network request failures

## 📞 **Support**

### **If Still Having Issues:**

1. **Check PayPal Developer Dashboard:**
   - Verify app is active
   - Check allowed origins
   - Ensure credentials are correct

2. **Test with Different Payment Method:**
   - Try the "Pay by Card" fallback option
   - This bypasses PayPal validation

3. **Contact PayPal Support:**
   - For sandbox issues: PayPal Developer Support
   - For production issues: PayPal Business Support

## ✅ **Checklist**

- [ ] Added PayPal Client Secret to backend
- [ ] Set PAYPAL_BASE_URL correctly
- [ ] Restarted backend server
- [ ] Tested with sandbox account
- [ ] Verified booking creation
- [ ] Checked confirmation emails
- [ ] Ready for production (when needed)
