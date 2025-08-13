# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `agency.backend/backend` directory with the following variables:

```bash
# Database Configuration
DB_PASSWORD=your_secure_database_password

# Email Configuration  
MAIL_USERNAME=rilindi-shpk@hotmail.com
MAIL_PASSWORD=your_email_app_password

# CORS Configuration (Production)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# PayPal Configuration (REQUIRED for payment validation)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com

# For production, use:
# PAYPAL_BASE_URL=https://api-m.paypal.com
```

## How to Set Environment Variables

### Option 1: Create .env file
```bash
cd agency.backend/backend
cp .env.example .env
# Edit .env with your actual values
```

### Option 2: Export in terminal
```bash
export PAYPAL_CLIENT_ID="your_client_id"
export PAYPAL_CLIENT_SECRET="your_client_secret"
export PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
```

### Option 3: Set in application.properties
Edit `src/main/resources/application.properties`:
```properties
paypal.client.id=your_client_id
paypal.client.secret=your_client_secret
paypal.base.url=https://api-m.sandbox.paypal.com
```

## Getting PayPal Credentials

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Log in to your developer account
3. Navigate to "Apps & Credentials"
4. Create a new app or use existing one
5. Copy the Client ID and Client Secret

## Testing vs Production

- **Sandbox**: Use for testing with fake PayPal accounts
- **Production**: Use real PayPal accounts and transactions
