#!/bin/bash

# PayPal Environment Variables Setup Script
# This script sets up the required PayPal environment variables

echo "🔧 Setting up PayPal Environment Variables..."
echo ""

# Set PayPal environment variables
export PAYPAL_CLIENT_ID="Abnz_dIwA50AWSeKzCk-021q3fosUWLg6JDFmmmKFmVawGGhNaJr9rEjPSWEiqLdk5Qnn0NTR_XsZarX"
export PAYPAL_CLIENT_SECRET="EP17Nhh0FHFwhSwMX5m1Lf3WY46hfUxt8QRXxJcJC6QOYdIQEvNj-_7HxRbt08hnmKlfsIPk8zW2etha"
export PAYPAL_BASE_URL="https://api-m.paypal.com"

echo "✅ Environment variables set:"
echo "   PAYPAL_CLIENT_ID: ${PAYPAL_CLIENT_ID:0:20}..."
echo "   PAYPAL_CLIENT_SECRET: ${PAYPAL_CLIENT_SECRET:0:20}..."
echo "   PAYPAL_BASE_URL: $PAYPAL_BASE_URL"
echo ""

echo "🚀 You can now start your backend with:"
echo "   cd agency.backend/backend"
echo "   ./mvnw spring-boot:run"
echo ""

echo "📝 Note: These variables are only set for this terminal session."
echo "   For permanent setup, add them to your ~/.bashrc or ~/.zshrc file."
echo ""

# Test if variables are accessible
if [ -n "$PAYPAL_CLIENT_ID" ] && [ -n "$PAYPAL_CLIENT_SECRET" ]; then
    echo "✅ Environment variables are properly set!"
else
    echo "❌ Error: Environment variables not set properly"
    exit 1
fi
