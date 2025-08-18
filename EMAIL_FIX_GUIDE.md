# Email Service Fix Guide

## Problem Identified

The error in the logs shows that the `EmailService.sendAgencyBookingNotification` method is failing because the `agencyEmail` field is null or empty. This happens when the `app.agency.email` property is not properly configured.

## Root Cause

1. **Missing Environment Variable**: The `AGENCY_EMAIL` environment variable is not set on Railway
2. **Missing Property Configuration**: The `app.agency.email` property was missing from the Railway configuration
3. **Insufficient Error Handling**: The email service didn't have proper null checking

## Fixes Applied

### 1. Enhanced Error Handling
- Added null checking for `agencyEmail` in `sendAgencyBookingNotification()`
- Added null checking for customer email in `sendCustomerBookingConfirmation()`
- Added validation for recipient email addresses in `sendHtmlMessage()` and `sendSimpleMessage()`

### 2. Configuration Updates
- Added `app.agency.email=${AGENCY_EMAIL:rilindishpk1@gmail.com}` to `application-railway.properties`
- Added debugging logs to track email configuration status

### 3. Debugging Tools
- Added `/api/bookings/email-config` endpoint to check email configuration
- Added constructor logging to track email service initialization
- Created `check-email-config.sh` script for Railway setup

## Required Environment Variables

Set these environment variables on Railway:

```bash
MAIL_USERNAME=rilindishpk1@gmail.com
MAIL_PASSWORD=<your-gmail-app-password>
AGENCY_EMAIL=rilindishpk1@gmail.com
```

## How to Set Up Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification if not already enabled
3. Go to 'App passwords'
4. Generate a new app password for 'Mail'
5. Use that password as `MAIL_PASSWORD`

## Deployment Steps

1. **Deploy the updated code:**
   ```bash
   railway up
   ```

2. **Set environment variables on Railway:**
   ```bash
   railway variables set MAIL_USERNAME=rilindishpk1@gmail.com
   railway variables set MAIL_PASSWORD=<your-gmail-app-password>
   railway variables set AGENCY_EMAIL=rilindishpk1@gmail.com
   ```

3. **Test the email configuration:**
   ```bash
   curl https://your-railway-url/api/bookings/email-config
   ```

4. **Test email sending:**
   ```bash
   curl -X POST 'https://your-railway-url/api/bookings/test-email?email=your-test-email@example.com'
   ```

## Expected Behavior After Fix

1. **Customer Email**: When a booking is created, the customer will receive a beautiful HTML invoice email with all booking details
2. **Agency Email**: The agency (rilindishpk1@gmail.com) will receive a notification email with booking summary
3. **Error Handling**: If email configuration is missing, clear error messages will be logged instead of crashes
4. **PayPal Integration**: PayPal emails will continue to work as before (no changes to payment flow)

## Monitoring

Check the logs for these success messages:
- `✅ HTML email sent successfully to: [email]`
- `Customer booking confirmation sent to: [email]`
- `Agency booking notification sent to: [email]`

## Troubleshooting

If emails still don't work:

1. **Check configuration:**
   ```bash
   curl https://your-railway-url/api/bookings/email-config
   ```

2. **Check Railway environment variables:**
   ```bash
   railway variables list
   ```

3. **Check application logs for specific error messages**

4. **Verify Gmail app password is correct and 2FA is enabled**

## Files Modified

- `agency.backend/src/main/java/com/agency/backend/service/EmailService.java`
- `agency.backend/src/main/java/com/agency/backend/controller/BookingController.java`
- `agency.backend/src/main/resources/application-railway.properties`
- `check-email-config.sh` (new)
- `EMAIL_FIX_GUIDE.md` (new)
