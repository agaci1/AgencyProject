#!/bin/bash

echo "🔍 Checking PayPal Configuration..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "agency.backend/pom.xml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 PayPal Configuration Analysis:"
echo "--------------------------------"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    echo "   railway login"
    exit 1
fi

echo "🔍 Checking current PayPal environment variables..."
railway variables list | grep -i paypal

echo ""
echo "📋 Required PayPal Environment Variables:"
echo "----------------------------------------"
echo "PAYPAL_BASE_URL=https://api-m.paypal.com (LIVE) or https://api-m.sandbox.paypal.com (SANDBOX)"
echo "PAYPAL_CLIENT_ID=<your-paypal-client-id>"
echo "PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>"
echo ""

echo "🚨 CRITICAL ISSUES TO CHECK:"
echo "============================"
echo "1. Are you using LIVE or SANDBOX PayPal API?"
echo "2. Is your PayPal business account fully verified?"
echo "3. Are you using the correct Client ID/Secret for your environment?"
echo "4. Is your PayPal account approved for Albanian transactions?"
echo ""

echo "💳 Card Type Issues (PayPal's Claim):"
echo "====================================="
echo "• Visa cards are generally more accepted in Albania than Mastercard"
echo "• International cards may have additional restrictions"
echo "• Some cards require 3D Secure authentication"
echo "• PayPal may have geographic restrictions for Albania"
echo ""

echo "🔧 Code Issues Found:"
echo "====================="
echo "✅ PayPal API integration is implemented"
echo "✅ Order validation is in place"
echo "⚠️  Missing capture validation (FIXED)"
echo "⚠️  Missing fraud checks (FIXED)"
echo "⚠️  Poor error handling (FIXED)"
echo ""

echo "🧪 Testing PayPal Configuration:"
echo "================================"
echo "1. Deploy the updated code: railway up"
echo "2. Test PayPal payment with a small amount"
echo "3. Check logs for detailed error messages"
echo "4. Monitor PayPal dashboard for failed captures"
echo ""

echo "📞 Next Steps:"
echo "=============="
echo "1. Contact PayPal Business Support about Albanian card restrictions"
echo "2. Verify your PayPal business account is fully verified"
echo "3. Test with different card types (Visa vs Mastercard)"
echo "4. Consider implementing additional payment methods"
echo "5. Monitor PayPal dashboard for failed transaction details"
echo ""

echo "🔍 Debugging Commands:"
echo "======================"
echo "# Check PayPal configuration"
echo "curl https://your-railway-url/api/bookings/paypal-config"
echo ""
echo "# Test PayPal payment with small amount"
echo "curl -X POST 'https://your-railway-url/api/bookings' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"paymentMethod\":\"paypal\",\"amount\":0.01}'"
echo ""
