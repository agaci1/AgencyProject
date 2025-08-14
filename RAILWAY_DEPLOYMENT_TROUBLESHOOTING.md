# Railway Deployment Troubleshooting Guide

## Current Issue: Database Connection Failure

The application is crashing due to HikariCP connection pool failure to establish database connections.

### Root Cause Analysis

The error stack trace shows:
```
at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:111)
```

This indicates that the database connection pool cannot establish connections to the MySQL database.

### Recent Fixes Applied

1. **Profile Configuration Fixed**: Changed from `prod` to `railway` profile in `railway.toml`
2. **Enhanced Database URL**: Added connection parameters for better stability
3. **Optimized Connection Pool**: Reduced pool size and added validation
4. **Improved Health Check**: Changed to use `/health/database` endpoint

### Configuration Changes Made

#### 1. railway.toml
```toml
[deploy]
startCommand = "cd agency.backend && java -jar target/*.jar --spring.profiles.active=railway"
healthcheckPath = "/health/database"
```

#### 2. application-railway.properties
- Enhanced DATABASE_URL with connection parameters
- Optimized HikariCP settings for Railway environment
- Added comprehensive logging for debugging

### Environment Variables Required

Ensure these environment variables are set in Railway:

**Required:**
- `DATABASE_URL` - MySQL connection string from Railway
- `DATABASE_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `PORT` - Application port (usually auto-set by Railway)

**Optional but recommended:**
- `DATABASE_DRIVER` - Should be `com.mysql.cj.jdbc.Driver`
- `CORS_ALLOWED_ORIGINS` - For frontend communication
- `MAIL_USERNAME` - For email notifications
- `MAIL_PASSWORD` - For email notifications
- `PAYPAL_CLIENT_ID` - For payment processing
- `PAYPAL_CLIENT_SECRET` - For payment processing

### Verification Steps

1. **Check Environment Variables in Railway Dashboard**
   - Go to your Railway project
   - Navigate to Variables tab
   - Ensure all required variables are set

2. **Verify Database Service**
   - Check if MySQL service is running
   - Verify database credentials
   - Test connection manually if possible

3. **Monitor Deployment Logs**
   - Watch the deployment logs for connection errors
   - Look for HikariCP debug messages
   - Check for any missing environment variables

### Debug Commands

Run the debug script locally to test configuration:
```bash
./debug-railway-deployment.sh
```

### Common Issues and Solutions

#### Issue 1: DATABASE_URL not set
**Symptoms**: Application fails to start with datasource errors
**Solution**: Add DATABASE_URL environment variable in Railway

#### Issue 2: Database credentials incorrect
**Symptoms**: Authentication failed errors
**Solution**: Verify DATABASE_USERNAME and DB_PASSWORD in Railway

#### Issue 3: Database service not available
**Symptoms**: Connection timeout errors
**Solution**: Check if MySQL service is provisioned and running

#### Issue 4: Network connectivity issues
**Symptoms**: Connection refused errors
**Solution**: Ensure database service is in the same Railway project

### Health Check Endpoints

- `/api/ping` - Basic application health
- `/health/database` - Database connectivity check
- `/health` - General health status

### Monitoring and Logs

Enable debug logging by setting these environment variables:
```
logging.level.com.zaxxer.hikari=DEBUG
logging.level.org.springframework.jdbc=DEBUG
logging.level.org.springframework.boot.autoconfigure.jdbc=DEBUG
```

### Next Steps

1. Deploy the updated configuration
2. Monitor the deployment logs
3. Check the health endpoint: `https://your-app.railway.app/health/database`
4. If issues persist, run the debug script and check logs

### Contact Information

If issues persist after following this guide:
1. Check Railway documentation
2. Review application logs thoroughly
3. Verify all environment variables are correctly set
