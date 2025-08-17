# Email System Setup Guide

## 🚨 Current Issue
The email system is currently disabled because the email credentials are not properly configured. This means:
- ❌ No booking confirmation emails are sent to customers
- ❌ No notification emails are sent to the agency
- ❌ Customers don't receive receipts for their bookings

## 🔧 How to Fix

### Option 1: Gmail Setup (Recommended)

1. **Create a Gmail App Password:**
   - Go to your Google Account settings: https://myaccount.google.com/
   - Navigate to "Security" → "2-Step Verification" (enable if not already)
   - Go to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "RILINDI SHPK Booking System"
   - Copy the generated 16-character password

2. **Set Environment Variables:**
   ```bash
   # For Railway deployment
   MAIL_USERNAME=rilindishpk1@gmail.com
   MAIL_PASSWORD=your-16-character-app-password
   
   # For local development
   export MAIL_USERNAME=rilindishpk1@gmail.com
   export MAIL_PASSWORD=your-16-character-app-password
   ```

### Option 2: Outlook/Hotmail Setup

1. **Enable App Passwords:**
   - Go to https://account.live.com/proofs/AppPassword
   - Generate an app password for "Mail"
   - Copy the generated password

2. **Set Environment Variables:**
   ```bash
   # For Railway deployment
   MAIL_USERNAME=rilindishpk1@gmail.com
   MAIL_PASSWORD=your-outlook-app-password
   
   # For local development
   export MAIL_USERNAME=rilindishpk1@gmail.com
   export MAIL_PASSWORD=your-outlook-app-password
   ```

## 🚀 Railway Deployment Setup

1. **Go to Railway Dashboard:**
   - Navigate to your project: https://railway.app/dashboard
   - Click on your backend service

2. **Add Environment Variables:**
   - Go to "Variables" tab
   - Add these variables:
     ```
     MAIL_USERNAME=rilindishpk1@gmail.com
     MAIL_PASSWORD=your-app-password
     ```

3. **Redeploy:**
   - Railway will automatically redeploy when you add environment variables
   - Check the logs to see if email system is configured

## 🧪 Testing the Email System

### Test Endpoint
Once configured, you can test the email system using this endpoint:

```bash
# Test with your email
curl -X POST "https://your-railway-url/api/bookings/test-email?email=your-email@example.com"
```

### Expected Response
- ✅ Success: "Test email sent successfully to: your-email@example.com"
- ❌ Error: Check the logs for specific error messages

## 📧 Email Templates

The system sends two types of emails:

### 1. Customer Booking Confirmation
- **Recipient:** Customer's email address
- **Content:** Beautiful HTML receipt with booking details
- **Includes:** Booking ID, tour details, payment breakdown, contact info

### 2. Agency Notification
- **Recipient:** rilindishpk1@gmail.com (agency email)
- **Content:** Professional notification with customer and booking details
- **Includes:** Customer info, trip details, payment summary, action buttons

## 🔍 Troubleshooting

### Common Issues:

1. **"Email system not configured"**
   - Check that MAIL_USERNAME and MAIL_PASSWORD are set
   - Verify the app password is correct

2. **"Authentication failed"**
   - Ensure 2-factor authentication is enabled
   - Generate a new app password
   - Check that you're using the app password, not your regular password

3. **"Connection timeout"**
   - Check your internet connection
   - Verify the SMTP settings are correct

### Debug Steps:

1. **Check Railway Logs:**
   ```bash
   # View real-time logs
   railway logs
   ```

2. **Look for Email Logs:**
   - Search for "📧" in the logs
   - Look for "✅ Email system configured successfully"
   - Check for any "❌" error messages

3. **Test Locally:**
   ```bash
   # Set environment variables
   export MAIL_USERNAME=rilindishpk1@gmail.com
   export MAIL_PASSWORD=your-app-password
   
   # Run the backend
   cd agency.backend
   ./mvnw spring-boot:run
   ```

## 🎯 Expected Behavior After Setup

1. **When a booking is made:**
   - Customer receives a beautiful HTML confirmation email
   - Agency receives a notification email
   - Both emails include all booking details and payment information

2. **Email Content:**
   - Professional branding with RILINDI SHPK logo
   - Complete booking details (dates, guests, payment)
   - Contact information and next steps
   - Mobile-responsive design

## 🔐 Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ Environment variables keep credentials secure
- ✅ Emails are sent over encrypted SMTP connections
- ✅ No sensitive data is logged in production

## 📞 Support

If you continue to have issues:
1. Check the Railway logs for specific error messages
2. Verify your email provider's SMTP settings
3. Test with a different email provider if needed
4. Contact support with the specific error messages from the logs


