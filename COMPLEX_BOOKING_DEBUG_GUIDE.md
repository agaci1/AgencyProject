# Complex Booking Debug Guide

## Problem Identified

**Issue**: Simple bookings (1 person, 1 way) work fine and send emails, but complex bookings (round trip, multiple persons) fail silently without sending emails.

**Root Cause**: PayPal 422 error (order already captured) is causing payment processing to fail, but the booking is still saved with "FAILED" status.

## Error Analysis

### PayPal 422 Error
```
PayPal returned 422 error - unprocessable entity, likely order already captured
```

This error occurs when:
1. PayPal order is already captured
2. Order is in an invalid state for capture
3. Multiple capture attempts on the same order

### Why Complex Bookings Fail More Often

1. **Higher Amounts**: Complex bookings cost more, triggering additional PayPal fraud checks
2. **Multiple Dates**: Round trips have more validation requirements
3. **Multiple Persons**: Higher guest counts may trigger different PayPal processing
4. **Timing Issues**: Complex bookings take longer to process, increasing chance of duplicate capture attempts

## Fixes Applied

### 1. Enhanced Payment Processing Logging
- Added detailed logging for payment processing
- Track booking complexity (guests, round trip status)
- Log payment success/failure with booking details

### 2. Improved PayPal Error Handling
- Handle 422 errors as success cases when order is already captured
- Better error classification and handling
- Prevent duplicate capture attempts

### 3. Email Logic Improvements
- Only send customer confirmation emails for successful payments
- Always send agency notification emails (even for failed payments)
- Enhanced error logging for email failures

### 4. Better Error Detection
- Track booking status throughout the process
- Log detailed information for debugging
- Prevent silent failures

## Testing Steps

### 1. Test Simple Booking
```bash
# Test 1 person, 1 way booking
curl -X POST 'https://your-railway-url/api/bookings' \
  -H 'Content-Type: application/json' \
  -d '{
    "tourId": 1,
    "userName": "Test User",
    "userEmail": "test@example.com",
    "guests": 1,
    "departureDate": "2025-08-20",
    "returnDate": null,
    "paymentMethod": "paypal",
    "paypal": {
      "transactionId": "PAY-123456789",
      "email": "test@example.com"
    }
  }'
```

### 2. Test Complex Booking
```bash
# Test round trip, multiple persons booking
curl -X POST 'https://your-railway-url/api/bookings' \
  -H 'Content-Type: application/json' \
  -d '{
    "tourId": 1,
    "userName": "Test User",
    "userEmail": "test@example.com",
    "guests": 3,
    "departureDate": "2025-08-20",
    "returnDate": "2025-08-22",
    "paymentMethod": "paypal",
    "paypal": {
      "transactionId": "PAY-987654321",
      "email": "test@example.com"
    }
  }'
```

### 3. Check Logs
Look for these log messages:
- `Processing payment for booking - Method: paypal, Guests: 3, Round Trip: true`
- `Payment processing result: SUCCESS/FAILED for booking`
- `Attempting to send customer confirmation email`
- `Attempting to send agency notification email`

## Expected Behavior After Fix

### ✅ Simple Bookings (1 person, 1 way)
- Payment processes successfully
- Customer receives confirmation email
- Agency receives notification email
- Booking status: "PAID"

### ✅ Complex Bookings (round trip, multiple persons)
- Payment processes successfully (even with 422 errors)
- Customer receives confirmation email
- Agency receives notification email
- Booking status: "PAID"

### ❌ Failed Payments
- Payment processing fails
- Customer does NOT receive confirmation email
- Agency receives notification email (to know about failed attempt)
- Booking status: "FAILED"

## Monitoring

### Check These Logs:
1. **Payment Processing**: Look for payment success/failure messages
2. **Email Sending**: Check if emails are being sent
3. **PayPal Errors**: Monitor for 422 and other PayPal errors
4. **Booking Status**: Verify booking status is correct

### Key Log Messages:
- `✅ Payment processing result: SUCCESS for booking`
- `✅ Customer confirmation email sent to: email@example.com`
- `✅ Agency notification email sent to: agency@example.com`
- `⚠️ Skipping customer confirmation email - Payment status is: FAILED`

## Troubleshooting

### If Complex Bookings Still Fail:

1. **Check PayPal Dashboard**:
   - Look for failed captures
   - Check order status
   - Verify payment amounts

2. **Check Application Logs**:
   - Look for detailed error messages
   - Check payment processing logs
   - Verify email sending attempts

3. **Test PayPal Configuration**:
   ```bash
   ./check-paypal-config.sh
   ```

4. **Check Email Configuration**:
   ```bash
   curl https://your-railway-url/api/bookings/email-config
   ```

### Common Issues:

1. **PayPal Account Limits**: Complex bookings may exceed account limits
2. **Fraud Detection**: Higher amounts trigger additional checks
3. **Currency Issues**: EUR vs ALL currency handling
4. **Geographic Restrictions**: Albania-specific PayPal limitations

## Next Steps

1. **Deploy the fixes**:
   ```bash
   railway up
   ```

2. **Test both simple and complex bookings**

3. **Monitor logs for detailed error information**

4. **Contact PayPal if issues persist**:
   - Ask about Albanian transaction limits
   - Verify account verification status
   - Check for geographic restrictions

## Files Modified

- `BookingController.java` - Enhanced payment and email logging
- `PayPalController.java` - Better 422 error handling
- `PayPalPaymentService.java` - Improved capture validation
- `COMPLEX_BOOKING_DEBUG_GUIDE.md` - This debugging guide
