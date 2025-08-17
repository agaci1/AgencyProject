#!/bin/bash

# Email System Setup Script for RILINDI SHPK
# This script helps you set up email environment variables

echo "📧 RILINDI SHPK Email System Setup"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "agency.backend/pom.xml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected: AgencyProject/"
    exit 1
fi

echo "🔧 Setting up email environment variables..."
echo ""

# Function to validate email format
validate_email() {
    local email=$1
    if [[ $email =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Get email username
read -p "Enter your email address (e.g., rilindishpk1@gmail.com): " EMAIL_USERNAME

if ! validate_email "$EMAIL_USERNAME"; then
    echo "❌ Invalid email format. Please enter a valid email address."
    exit 1
fi

# Get email password
echo ""
echo "🔐 For the password, you need to use an APP PASSWORD, not your regular password."
echo "   This is more secure and required by most email providers."
echo ""
echo "📋 How to get an app password:"
echo "   • Gmail: https://myaccount.google.com/apppasswords"
echo "   • Outlook: https://account.live.com/proofs/AppPassword"
echo "   • Yahoo: https://login.yahoo.com/account/security"
echo ""

read -s -p "Enter your email app password: " EMAIL_PASSWORD
echo ""

if [ -z "$EMAIL_PASSWORD" ]; then
    echo "❌ Password cannot be empty."
    exit 1
fi

# Determine email provider and set host
EMAIL_HOST=""
if [[ $EMAIL_USERNAME == *"@gmail.com" ]]; then
    EMAIL_HOST="smtp.gmail.com"
    echo "✅ Detected Gmail account"
elif [[ $EMAIL_USERNAME == *"@outlook.com" ]] || [[ $EMAIL_USERNAME == *"@hotmail.com" ]]; then
    EMAIL_HOST="smtp-mail.outlook.com"
    echo "✅ Detected Outlook/Hotmail account"
elif [[ $EMAIL_USERNAME == *"@yahoo.com" ]]; then
    EMAIL_HOST="smtp.mail.yahoo.com"
    echo "✅ Detected Yahoo account"
else
    echo "⚠️  Unknown email provider. Using Gmail SMTP settings."
    EMAIL_HOST="smtp.gmail.com"
fi

echo ""
echo "📧 Email Configuration Summary:"
echo "   Host: $EMAIL_HOST"
echo "   Username: $EMAIL_USERNAME"
echo "   Password: [HIDDEN]"
echo ""

# Create .env file for local development
echo "🔧 Creating .env file for local development..."
cat > .env << EOF
# Email Configuration
MAIL_USERNAME=$EMAIL_USERNAME
MAIL_PASSWORD=$EMAIL_PASSWORD
MAIL_HOST=$EMAIL_HOST
MAIL_PORT=587

# Other environment variables
SPRING_PROFILES_ACTIVE=dev
EOF

echo "✅ Created .env file in project root"
echo ""

# Instructions for Railway
echo "🚀 Railway Deployment Instructions:"
echo "=================================="
echo ""
echo "1. Go to Railway Dashboard: https://railway.app/dashboard"
echo "2. Select your backend service"
echo "3. Go to 'Variables' tab"
echo "4. Add these environment variables:"
echo ""
echo "   MAIL_USERNAME=$EMAIL_USERNAME"
echo "   MAIL_PASSWORD=$EMAIL_PASSWORD"
echo ""
echo "5. Railway will automatically redeploy"
echo "6. Check the logs for '✅ Email system configured successfully'"
echo ""

# Test instructions
echo "🧪 Testing Instructions:"
echo "======================="
echo ""
echo "1. For local testing:"
echo "   source .env"
echo "   cd agency.backend"
echo "   ./mvnw spring-boot:run"
echo ""
echo "2. For Railway testing:"
echo "   curl -X POST 'https://your-railway-url/api/bookings/test-email?email=your-test-email@example.com'"
echo ""

echo "🎯 Next Steps:"
echo "=============="
echo "1. Set up the environment variables in Railway"
echo "2. Deploy the updated code"
echo "3. Test with a booking"
echo "4. Check both customer and agency emails"
echo ""

echo "📞 Need help? Check EMAIL_SYSTEM_SETUP.md for detailed instructions"
echo ""
echo "✅ Setup complete! Your email system is ready to configure."
