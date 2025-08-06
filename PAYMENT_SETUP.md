# Payment System Setup Guide

## 🔧 **Required Configuration**

### 1. Frontend Environment Variables

Create a `.env.local` file in the `agency.frontend` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE=http://localhost:8080

# PayPal Configuration (Add when owner provides credentials)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_ACTUAL_PAYPAL_CLIENT_ID_HERE
NEXT_PUBLIC_PAYPAL_CURRENCY=EUR
```

### 2. Backend PayPal Configuration

The backend is now configured to use environment variables. Set these environment variables:

```bash
# PayPal Configuration
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com  # Use https://api-m.paypal.com for production
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
```

## 🚀 **PayPal Setup Steps**

### 1. Create PayPal Developer Account
1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Sign up for a developer account
3. Create a new app to get your Client ID and Secret

### 2. Configure PayPal App
1. In your PayPal app settings, add your domain to allowed origins
2. For development: `http://localhost:3000`
3. For production: Your actual domain

### 3. Test vs Production
- **Sandbox**: Use for testing with fake PayPal accounts
- **Production**: Use real PayPal accounts and transactions

## 🔒 **Security Considerations**

### Current Issues to Fix:
1. **Email Credentials**: Move email credentials to environment variables
2. **Database Credentials**: Use environment variables for database connection
3. **HTTPS**: Ensure HTTPS in production

### Recommended Security Improvements:
```properties
# Move these to environment variables
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.datasource.password=${DB_PASSWORD}
```

## 🧪 **Testing the Payment System**

### 1. Start the Backend
```bash
cd agency.backend/backend
./mvnw spring-boot:run
```

### 2. Start the Frontend
```bash
cd agency.frontend
npm run dev
```

### 3. Test PayPal Integration
1. Go to a tour booking page
2. Fill in booking details
3. Click "Proceed to Payment"
4. Use PayPal sandbox accounts for testing

## 📋 **Current Payment System Status**

### ✅ **Working Components:**
- PayPal SDK integration
- Frontend payment flow
- Backend booking processing
- Email notifications
- Database storage

### ⚠️ **Needs Configuration:**
- PayPal Client ID and Secret
- Environment variables
- Production PayPal setup

### 🔄 **Payment Flow:**
1. User selects tour and fills booking details
2. Frontend loads PayPal SDK
3. User completes PayPal payment
4. Frontend sends booking data to backend
5. Backend validates payment and creates booking
6. Confirmation emails sent to customer and agency

## 🛠️ **Troubleshooting**

### Common Issues:
1. **PayPal not loading**: Check Client ID configuration
2. **Payment validation fails**: Verify PayPal credentials
3. **Email not sending**: Check SMTP configuration
4. **CORS errors**: Ensure backend CORS is properly configured

### Debug Steps:
1. Check browser console for PayPal SDK errors
2. Check backend logs for payment processing errors
3. Verify environment variables are loaded correctly
4. Test PayPal sandbox accounts

## 📞 **Support**

For payment system issues:
1. Check PayPal Developer documentation
2. Verify all environment variables are set
3. Test with PayPal sandbox accounts first
4. Check backend logs for detailed error messages 