#!/bin/bash

echo "🔍 Checking Email Configuration on Railway..."
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "agency.backend/pom.xml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📧 Current Email Configuration:"
echo "--------------------------------"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "   npm install -g @railway/cli"
    echo "   railway login"
    exit 1
fi

echo "🔍 Checking current environment variables..."
railway variables list

echo ""
echo "📋 Required Environment Variables for Email:"
echo "---------------------------------------------"
echo "MAIL_USERNAME=rilindishpk1@gmail.com"
echo "MAIL_PASSWORD=<your-gmail-app-password>"
echo "AGENCY_EMAIL=rilindishpk1@gmail.com"
echo ""

echo "🚀 To set up email configuration, run these commands:"
echo "-----------------------------------------------------"
echo "railway variables set MAIL_USERNAME=rilindishpk1@gmail.com"
echo "railway variables set MAIL_PASSWORD=<your-gmail-app-password>"
echo "railway variables set AGENCY_EMAIL=rilindishpk1@gmail.com"
echo ""

echo "📝 Instructions for Gmail App Password:"
echo "----------------------------------------"
echo "1. Go to https://myaccount.google.com/security"
echo "2. Enable 2-Step Verification if not already enabled"
echo "3. Go to 'App passwords'"
echo "4. Generate a new app password for 'Mail'"
echo "5. Use that password as MAIL_PASSWORD"
echo ""

echo "🧪 After setting up, test the email system:"
echo "--------------------------------------------"
echo "1. Deploy the updated code: railway up"
echo "2. Test email config: curl https://your-railway-url/api/bookings/email-config"
echo "3. Test email sending: curl -X POST 'https://your-railway-url/api/bookings/test-email?email=your-test-email@example.com'"
echo ""
