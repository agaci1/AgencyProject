# PayPal Integration Testing Guide

## ✅ **Configuration Complete**

Your PayPal credentials have been configured:

### Backend Configuration
- **Client ID**: `AZiaAPXJQxzMqKGYAS49_T2fu-ihY700KivI-8CqSkusYh48ee-9MXH-fszfpBhwkW9UjUjj8fraw99U`
- **Client Secret**: `EPx-cw8fktbTXkysL9_vkKAXhKcDr0QJCI0Ir4VngSJbXwCVzmviLUaksRkcGHquABIthJf6B-T-3iku`
- **Environment**: Sandbox (for testing)

### Frontend Configuration
- **Client ID**: Same as above
- **Currency**: EUR
- **API Base**: http://localhost:8080

## 🧪 **Testing Steps**

### 1. **Start Your Applications**

Backend should be running on port 8080:
```bash
cd agency.backend/backend
./mvnw spring-boot:run
```

Frontend should be running on port 3002:
```bash
cd agency.frontend
npm run dev
```

### 2. **Test PayPal Integration**

1. **Open your application**: http://localhost:3002
2. **Navigate to tours**: http://localhost:3002/tours
3. **Select a tour** and click "Book Now"
4. **Fill in booking details**:
   - Trip type: One-way or Round-trip
   - Departure date: Select a future date
   - Number of guests: 1 or more
   - Special requests: Optional
5. **Click "Proceed to Payment"**
6. **Choose PayPal** as payment method
7. **Complete PayPal payment** using sandbox account

### 3. **PayPal Sandbox Testing Accounts**

Use these accounts for testing (provided by PayPal):

**Buyer Account:**
- Email: `sb-buyer@business.example.com`
- Password: Check your PayPal Developer Portal

**Seller Account:**
- Email: `sb-seller@business.example.com`
- Password: Check your PayPal Developer Portal

## 🔧 **PayPal App Configuration**

### Required Settings in PayPal Developer Portal:

1. **Go to**: https://developer.paypal.com/
2. **Navigate to**: Apps & Credentials
3. **Select your app**
4. **Configure**:
   - **Allowed Origins**: `http://localhost:3002`
   - **Return URLs**: `http://localhost:3002/tours`

## 🚨 **Troubleshooting**

### Common Issues:

1. **"PayPal not loading"**:
   - Check browser console for errors
   - Verify Client ID is correct
   - Ensure PayPal app allows your domain

2. **"Payment validation failed"**:
   - Check backend logs for PayPal API errors
   - Verify Client Secret is correct
   - Check if PayPal credentials are loaded

3. **"CORS errors"**:
   - Backend is configured for ports 3000 and 3002
   - Frontend is running on port 3002

### Debug Steps:

1. **Check backend logs** for PayPal API calls
2. **Check browser console** for PayPal SDK errors
3. **Verify environment variables** are loaded
4. **Test with PayPal sandbox accounts**

## 📋 **Expected Flow**

1. User selects tour → Booking form
2. User fills details → Payment selection
3. User chooses PayPal → PayPal SDK loads
4. User completes payment → PayPal returns success
5. Frontend sends booking to backend
6. Backend validates payment with PayPal
7. Booking is created and emails sent
8. User sees confirmation

## 🎯 **Success Indicators**

- PayPal button loads without errors
- Payment completes successfully
- Booking is created in database
- Confirmation emails are sent
- User sees success message

## 📞 **Next Steps**

Once testing is successful:
1. Test with different tour selections
2. Test with different payment amounts
3. Verify email notifications work
4. Check booking data in database
5. Ready for production (change to production PayPal when needed) 