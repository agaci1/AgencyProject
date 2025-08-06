# Database Connection Issues - Quick Fix

## Problem
The application cannot connect to the MySQL database on Railway. This could be due to:
- Railway database being down
- Network connectivity issues
- Credentials changed
- Database URL changed

## Quick Solution: Switch to H2 Database

### Step 1: Edit application.properties
Open `src/main/resources/application.properties` and comment out the MySQL configuration, then uncomment the H2 configuration:

```properties
# Comment out MySQL configuration
# spring.datasource.url=${DATABASE_URL:jdbc:mysql://maglev.proxy.rlwy.net:56319/railway?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8}
# spring.datasource.username=${DATABASE_USERNAME:root}
# spring.datasource.password=${DB_PASSWORD:OMXjWrwYrRLqhRypmiEwECaCrGNULAHe}
# spring.datasource.driver-class-name=${DATABASE_DRIVER:com.mysql.cj.jdbc.Driver}

# Uncomment H2 configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
```

### Step 2: Restart the application
The application will now use an in-memory H2 database.

### Step 3: Access H2 Console (Optional)
If you want to view the database, go to: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

## Important Notes
- H2 is an in-memory database, so data will be lost when the application restarts
- This is only for development/testing
- For production, you need to fix the MySQL connection

## To Switch Back to MySQL
1. Comment out the H2 configuration
2. Uncomment the MySQL configuration
3. Ensure the Railway database is accessible
4. Restart the application

## Troubleshooting MySQL Connection
1. Check if Railway is accessible: https://railway.app/
2. Verify the database URL and credentials
3. Check network connectivity
4. Try connecting with a MySQL client to verify the connection details 