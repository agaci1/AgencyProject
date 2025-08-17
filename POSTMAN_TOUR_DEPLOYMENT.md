# Postman Tour Deployment & Management

## Base URL
```
https://agencyproject-production-dbfc.up.railway.app
```

## Tour Deployment Collection

### 1. Clear Existing Tours
**DELETE** `/tours/clear` (if you add this endpoint)
- **Purpose**: Remove all existing tours before deployment
- **Alternative**: Use individual DELETE calls for each tour ID

### 2. Deploy Albania Tours

#### Tour 1: Tirana -> Koman
**POST** `/tours`
```json
{
  "title": "Tirana [Terminal] -> Koman",
  "description": "Bus trip from Tirana through the Albanian Alps to Koman ferry dock",
  "location": "Tirana",
  "departureTime": "06:00",
  "image": "/koman .jpg",
  "price": 10.0,
  "rating": 5.0,
  "maxGuests": 50,
  "routeDescription": "Departure from Tirana North-South Terminal at 06:00, arriving at Koman ferry dock",
  "startLocationLink": "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6",
  "highlights": ["Albanian Alps", "Scenic mountain roads", "Koman ferry dock", "Early morning departure"]
}
```

#### Tour 2: Koman -> Tirana
**POST** `/tours`
```json
{
  "title": "Koman -> Tirana",
  "description": "Afternoon return journey from Koman to Tirana",
  "location": "Koman",
  "departureTime": "15:30",
  "image": "/Tirana.webp",
  "price": 10.0,
  "rating": 5.0,
  "maxGuests": 50,
  "routeDescription": "Departure from Koman ferry dock at 15:30, arriving at Tirana North-South Terminal",
  "startLocationLink": "https://maps.app.goo.gl/HBLEbRbWruJBKf4KA",
  "highlights": ["Return journey", "Afternoon departure", "Tirana terminal", "Comfortable bus ride"]
}
```

#### Tour 3: Fierza -> Valbonë
**POST** `/tours`
```json
{
  "title": "Fierza -> Valbonë",
  "description": "Ride through mountainous roads from Fierza to Valbonë",
  "location": "Fierza",
  "departureTime": "12:30",
  "image": "/valbona.jpg",
  "price": 7.0,
  "rating": 5.0,
  "maxGuests": 50,
  "routeDescription": "Departure at 12:30 from Fierza ferry area to Valbonë village",
  "startLocationLink": "https://maps.app.goo.gl/LyzZLKrrHtUZdesM6",
  "highlights": ["Mountainous terrain", "Valbonë village", "Scenic mountain roads", "Fierza ferry connection"]
}
```

#### Tour 4: Valbonë -> Fierza (Ferry)
**POST** `/tours`
```json
{
  "title": "Valbonë -> Fierza (Ferry)",
  "description": "A scenic transfer from Valbonë to Fierza, where you can catch the ferry",
  "location": "Valbonë",
  "departureTime": "10:00",
  "image": "/fierza.jpg",
  "price": 7.0,
  "rating": 5.0,
  "maxGuests": 50,
  "routeDescription": "Departure from Valbonë at 10:00 heading towards Fierza ferry dock",
  "startLocationLink": "https://maps.app.goo.gl/ieNwY6kLX8Ea6gKz8",
  "highlights": ["Valbonë departure", "Ferry connection", "Scenic transfer", "Fierza ferry dock"]
}
```

#### Tour 5: China -> Russia (€0.01)
**POST** `/tours`
```json
{
  "title": "China -> Russia",
  "description": "Transcontinental journey from China to Russia - low cost option for testing",
  "location": "China",
  "departureTime": "14:00",
  "image": "/Tirana.webp",
  "price": 0.01,
  "rating": 5.0,
  "maxGuests": 10,
  "routeDescription": "Departure from China border crossing to Russia",
  "startLocationLink": "https://maps.app.goo.gl/CbEDq9ZmBcyqH5jS6",
  "highlights": ["Transcontinental", "Border Crossing", "Low Cost"]
}
```

## Deployment Workflow

### Step 1: Verify Backend
**GET** `/health`
- Should return 200 OK

### Step 2: Check Current Tours
**GET** `/tours`
- See what tours currently exist

### Step 3: Clear Old Tours (if needed)
- Use DELETE `/tours/{id}` for each existing tour
- Or add a bulk delete endpoint

### Step 4: Deploy New Tours
- Execute each POST request in sequence
- Verify each tour is created successfully

### Step 5: Verify Deployment
**GET** `/tours`
- Should return all 5 tours

## Benefits of Postman Deployment

1. **No Code Changes**: Deploy tours without touching code
2. **Immediate Updates**: Changes take effect instantly
3. **Version Control**: Save Postman collections for different tour sets
4. **Environment Management**: Different tours for dev/staging/prod
5. **Easy Rollback**: Delete and redeploy specific tours
6. **No Database Scripts**: No need for data.sql files

## Headers for All Requests
```
Content-Type: application/json
Accept: application/json
```

## Environment Variables
Create a Postman environment with:
- `baseUrl`: `https://agencyproject-production-dbfc.up.railway.app`
- `tourId`: For storing created tour IDs

This approach gives you full control over tour deployment without needing to redeploy the entire application!
