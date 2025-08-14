# Railway Environment Variables Setup Guide

## Required Environment Variables

Go to your Railway project → **Variables** tab and set these variables:

### Database Configuration
```
DATABASE_URL=jdbc:mysql://<host>:<port>/<database>?useSSL=false&serverTimezone=UTC
DATABASE_USERNAME=<your_username>
DB_PASSWORD=<your_password>
```

### Application Configuration
```
PORT=8080
SPRING_PROFILES_ACTIVE=railway
```

### Optional (for full functionality)
```
CORS_ALLOWED_ORIGINS=https://rilindishpk.com,https://www.rilindishpk.com,http://localhost:3000
MAIL_USERNAME=<your_email>
MAIL_PASSWORD=<your_email_password>
PAYPAL_CLIENT_ID=<your_paypal_client_id>
PAYPAL_CLIENT_SECRET=<your_paypal_client_secret>
```

## How to Get Railway MySQL Details

1. **Go to your Railway project dashboard**
2. **Find your MySQL service** (should be listed under Services)
3. **Click on the MySQL service**
4. **Go to the "Connect" tab**
5. **Copy the connection details:**

### Example Railway MySQL Connection Details:
- **Host**: `containers-us-west-123.railway.app`
- **Port**: `1234`
- **Database**: `railway`
- **Username**: `root`
- **Password**: `your_password`

### Example DATABASE_URL:
```
jdbc:mysql://containers-us-west-123.railway.app:1234/railway?useSSL=false&serverTimezone=UTC
```

## Verification Steps

1. **Set all variables in Railway Variables tab**
2. **Redeploy your application**
3. **Check the deployment logs for any "Caused by" errors**
4. **Test the health endpoint**: `https://your-app.railway.app/health/database`

## Common Issues

### Issue: "Communications link failure"
- **Cause**: Database host/port incorrect
- **Solution**: Verify DATABASE_URL host and port

### Issue: "Access denied for user"
- **Cause**: Wrong username/password
- **Solution**: Check DATABASE_USERNAME and DB_PASSWORD

### Issue: "Unknown database"
- **Cause**: Wrong database name
- **Solution**: Verify database name in DATABASE_URL

## Testing Database Connection

You can test the database connection locally using the Railway CLI:

```bash
# Install Railway CLI if you haven't
npm install -g @railway/cli

# Login to Railway
railway login

# Connect to your project
railway link

# Test database connection
railway connect
```

This will help verify if the database is accessible before deploying the application.
