#!/bin/bash

echo "=== Railway Deployment Debug Script ==="
echo "Date: $(date)"
echo ""

echo "=== Environment Variables Check ==="
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..." # Show first 50 chars for security
echo "DATABASE_USERNAME: $DATABASE_USERNAME"
echo "DB_PASSWORD: ${DB_PASSWORD:+SET}" # Just show if it's set
echo "DATABASE_DRIVER: $DATABASE_DRIVER"
echo "SPRING_PROFILES_ACTIVE: $SPRING_PROFILES_ACTIVE"
echo ""

echo "=== Java Version ==="
java -version
echo ""

echo "=== Current Directory ==="
pwd
ls -la
echo ""

echo "=== Backend Directory ==="
cd agency.backend
pwd
ls -la
echo ""

echo "=== Maven Build Test ==="
./mvnw clean package -DskipTests
echo ""

echo "=== JAR File Check ==="
ls -la target/*.jar
echo ""

echo "=== Database Connection Test ==="
echo "Testing database connection with enhanced logging..."
java -jar target/*.jar --spring.profiles.active=railway --logging.level.com.zaxxer.hikari=DEBUG --logging.level.org.springframework.jdbc=DEBUG &
APP_PID=$!

# Wait for app to start
sleep 30

echo "=== Health Check Test ==="
curl -f http://localhost:8080/health/database || echo "Health check failed"

# Kill the app
kill $APP_PID
wait $APP_PID 2>/dev/null

echo ""
echo "=== Debug Complete ==="
