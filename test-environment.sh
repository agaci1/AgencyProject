#!/bin/bash

# Test Environment Variables Script
# Run this after setting up Railway environment variables

echo "🔍 Testing Environment Variables Configuration"
echo "=============================================="

# Test PayPal credentials
echo ""
echo "1. Testing PayPal Credentials..."
if [ -n "$PAYPAL_CLIENT_ID" ]; then
    echo "✅ PAYPAL_CLIENT_ID is set"
    echo "   First 10 chars: ${PAYPAL_CLIENT_ID:0:10}..."
else
    echo "❌ PAYPAL_CLIENT_ID is NOT set"
fi

if [ -n "$PAYPAL_CLIENT_SECRET" ]; then
    echo "✅ PAYPAL_CLIENT_SECRET is set"
    echo "   First 10 chars: ${PAYPAL_CLIENT_SECRET:0:10}..."
else
    echo "❌ PAYPAL_CLIENT_SECRET is NOT set"
fi

# Test email configuration
echo ""
echo "2. Testing Email Configuration..."
if [ -n "$MAIL_USERNAME" ]; then
    echo "✅ MAIL_USERNAME is set: $MAIL_USERNAME"
else
    echo "❌ MAIL_USERNAME is NOT set"
fi

if [ -n "$MAIL_PASSWORD" ]; then
    echo "✅ MAIL_PASSWORD is set"
    echo "   Length: ${#MAIL_PASSWORD} characters"
else
    echo "❌ MAIL_PASSWORD is NOT set"
fi

# Test database configuration
echo ""
echo "3. Testing Database Configuration..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL is set"
    echo "   Contains MySQL: $(echo $DATABASE_URL | grep -q 'mysql' && echo 'Yes' || echo 'No')"
else
    echo "❌ DATABASE_URL is NOT set"
fi

if [ -n "$DATABASE_USERNAME" ]; then
    echo "✅ DATABASE_USERNAME is set: $DATABASE_USERNAME"
else
    echo "❌ DATABASE_USERNAME is NOT set"
fi

if [ -n "$DB_PASSWORD" ]; then
    echo "✅ DB_PASSWORD is set"
    echo "   Length: ${#DB_PASSWORD} characters"
else
    echo "❌ DB_PASSWORD is NOT set"
fi

# Test application configuration
echo ""
echo "4. Testing Application Configuration..."
if [ -n "$SPRING_PROFILES_ACTIVE" ]; then
    echo "✅ SPRING_PROFILES_ACTIVE is set: $SPRING_PROFILES_ACTIVE"
else
    echo "❌ SPRING_PROFILES_ACTIVE is NOT set"
fi

if [ -n "$PORT" ]; then
    echo "✅ PORT is set: $PORT"
else
    echo "❌ PORT is NOT set"
fi

# Summary
echo ""
echo "📊 Summary:"
echo "==========="

required_vars=("PAYPAL_CLIENT_ID" "PAYPAL_CLIENT_SECRET" "MAIL_USERNAME" "MAIL_PASSWORD" "DATABASE_URL" "DATABASE_USERNAME" "DB_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "🎉 All required environment variables are set!"
    echo "✅ Your application should work correctly"
else
    echo "⚠️  Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   ❌ $var"
    done
    echo ""
    echo "Please set these variables in Railway before deploying."
fi

echo ""
echo "🔗 Next Steps:"
echo "1. Set missing variables in Railway Variables tab"
echo "2. Redeploy your application"
echo "3. Test the booking flow with a small amount"
echo "4. Check logs for any errors"
