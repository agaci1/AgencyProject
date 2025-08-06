# PayPal Setup Guide - After Getting Developer Account

## 🎯 **What You Need to Do Now**

### 1. **Get Your PayPal Credentials**

1. **Go to PayPal Developer Portal**: https://developer.paypal.com/
2. **Log in** to your developer account
3. **Navigate to "Apps & Credentials"**
4. **Create a new app** (if you haven't already):
   - Click "Create App"
   - Give it a name (e.g., "Agency Travel Booking")
   - Select "Business" account type
5. **Copy your credentials**:
   - **Client ID** (starts with "A" for sandbox)
   - **Client Secret** (long string)

### 2. **Configure Your Application**

#### Option A: Environment Variables (Recommended)

Create a `.env` file in the `agency.backend/backend` directory:

```bash
# PayPal Configuration
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
PAYPAL_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_HERE

# Email Configuration
MAIL_USERNAME=rilindi-shpk@hotmail.com
MAIL_PASSWORD=taxluwqrmvpcbytu

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001
```

#### Option B: Direct in application.properties

Edit `agency.backend/backend/src/main/resources/application.properties`:

```properties
# Replace these lines:
paypal.client.id=${PAYPAL_CLIENT_ID:YOUR_ACTUAL_CLIENT_ID_HERE}
paypal.client.secret=${PAYPAL_CLIENT_SECRET:YOUR_ACTUAL_CLIENT_SECRET_HERE}
```

### 3. **Configure PayPal App Settings**

In your PayPal Developer Portal:

1. **Go to your app settings**
2. **Add allowed origins**:
   - For development: `http://localhost:3000`
   - For production: Your actual domain
3. **Add return URLs** (if needed):
   - `http://localhost:3000/tours`
   - `http://localhost:3000/booking-success`

### 4. **Test Your Setup**

1. **Start the backend**:
   ```bash
   cd agency.backend/backend
   ./mvnw spring-boot:run
   ```

2. **Start the frontend**:
   ```bash
   cd agency.frontend
   npm run dev
   ```

3. **Test a booking**:
   - Go to http://localhost:3000/tours
   - Select a tour
   - Fill booking details
   - Choose PayPal payment
   - Complete payment with sandbox account

### 5. **PayPal Sandbox Testing**

For testing, use these sandbox accounts:

**Buyer Account:**
- Email: `sb-buyer@business.example.com`
- Password: (provided in PayPal sandbox)

**Seller Account:**
- Email: `sb-seller@business.example.com`
- Password: (provided in PayPal sandbox)

### 6. **Production Setup**

When ready for production:

1. **Switch to production PayPal**:
   - Change `PAYPAL_BASE_URL` to `https://api-m.paypal.com`
   - Use production Client ID and Secret
   - Update allowed origins to your production domain

2. **Update frontend**:
   - Change PayPal environment from `sandbox` to `production`

## 🔧 **Troubleshooting**

### Common Issues:

1. **"PayPal not loading"**:
   - Check Client ID is correct
   - Verify allowed origins in PayPal app settings

2. **"Payment validation failed"**:
   - Check Client Secret is correct
   - Verify PayPal credentials in backend

3. **"CORS errors"**:
   - Ensure backend CORS is configured correctly
   - Check frontend is running on allowed origin

### Debug Steps:

1. **Check backend logs** for PayPal API errors
2. **Check browser console** for PayPal SDK errors
3. **Verify environment variables** are loaded correctly
4. **Test with PayPal sandbox accounts** first

## 📞 **Need Help?**

1. Check PayPal Developer documentation
2. Verify all credentials are correct
3. Test with sandbox accounts before going live
4. Check application logs for detailed error messages

## ✅ **Checklist**

- [ ] Got PayPal Client ID and Secret
- [ ] Configured environment variables
- [ ] Set up PayPal app allowed origins
- [ ] Tested with sandbox accounts
- [ ] Verified payment flow works
- [ ] Ready for production (when needed) 