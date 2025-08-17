# Postman Tours API Testing Guide

## Base URL
```
https://agencyproject-production-dbfc.up.railway.app
```

## Collection Setup

### 1. Health Check
**GET** `/health`
- **Purpose**: Verify backend is running
- **Expected**: 200 OK with application status

### 2. Database Health Check
**GET** `/health/database`
- **Purpose**: Verify database connection
- **Expected**: 200 OK with database details

### 3. Tour Controller Test
**GET** `/tours/test`
- **Purpose**: Test if TourController is working
- **Expected**: 200 OK with "Tour controller is working - Database tours only"

### 4. Get All Tours
**GET** `/tours`
- **Purpose**: Fetch all tours from database
- **Expected**: 200 OK with array of tour objects
- **Headers**: 
  - `Content-Type: application/json`
  - `Accept: application/json`

### 5. Create New Tour
**POST** `/tours`
- **Purpose**: Create a new tour in database
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "title": "Test Tour via Postman",
  "description": "Testing tour creation",
  "location": "Test Location",
  "departureTime": "15:00",
  "image": "/test.jpg",
  "price": 5.0,
  "rating": 4.5,
  "maxGuests": 20,
  "routeDescription": "Test route description",
  "startLocationLink": "https://maps.google.com",
  "highlights": ["Test", "Postman", "API"]
}
```

### 6. Delete Tour
**DELETE** `/tours/{id}`
- **Purpose**: Delete a tour by ID
- **Expected**: 204 No Content if successful

## Testing Steps

1. **Start with Health Check**: Verify backend is running
2. **Check Database**: Ensure database connection is working
3. **Test Controller**: Verify TourController is accessible
4. **Fetch Tours**: Get current tours from database
5. **Create Tour**: Add a new tour to test database write
6. **Fetch Again**: Verify the new tour appears
7. **Delete Tour**: Test deletion functionality

## Expected Database Tours

After fresh deployment, you should see 5 tours:
1. Tirana [Terminal] → Koman (€10.00)
2. Koman → Tirana (€10.00)
3. Fierza → Valbonë (€7.00)
4. Valbonë → Fierza (Ferry) (€7.00)
5. China → Russia (€0.01)

## Troubleshooting

### If GET /tours returns 500:
- Check database connection
- Verify data.sql executed properly
- Check application logs

### If GET /tours returns 404:
- Verify TourController is deployed
- Check if endpoint mapping is correct

### If GET /tours returns empty array:
- Database might be empty
- Check if data.sql ran successfully
- Verify table structure

## CORS Testing

To test CORS from your frontend domain:
- Add header: `Origin: https://rilindishpk.com`
- Should return 200 OK with proper CORS headers
