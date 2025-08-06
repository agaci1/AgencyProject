# 🚀 Postman Guide for Adding Tours

## 📋 **Setup**

1. **Download Postman**: https://www.postman.com/downloads/
2. **Import this collection** or create new requests

## 🔗 **API Base URL**

- **Local Development**: `http://localhost:8080`
- **Production**: `https://agencyproject-production-dbfc.up.railway.app`

## 📝 **Add Tour Endpoint**

### **POST /api/tours**

**URL**: `{{base_url}}/api/tours`

**Headers**:
```
Content-Type: application/json
```

**Request Body** (JSON):
```json
{
  "title": "Tropoja Adventure",
  "description": "Explore the beautiful mountains and valleys of Tropoja",
  "price": 150.0,
  "departureTime": "08:00",
  "location": "Tropoja",
  "rating": 4.8,
  "image": "/tropojaFoto.jpg",
  "maxGuests": 15,
  "routeDescription": "Scenic mountain route through Valbona Valley",
  "startLocationLink": "https://maps.google.com/?q=Tropoja,Albania",
  "highlights": [
    "Mountain hiking",
    "Valley exploration", 
    "Local cuisine"
  ]
}
```

## 🎯 **Sample Tour Data**

### **Tour 1: Tropoja Adventure**
```json
{
  "title": "Tropoja Adventure",
  "description": "Explore the beautiful mountains and valleys of Tropoja",
  "price": 150.0,
  "departureTime": "08:00",
  "location": "Tropoja",
  "rating": 4.8,
  "image": "/tropojaFoto.jpg",
  "maxGuests": 15,
  "routeDescription": "Scenic mountain route through Valbona Valley",
  "startLocationLink": "https://maps.google.com/?q=Tropoja,Albania",
  "highlights": ["Mountain hiking", "Valley exploration", "Local cuisine"]
}
```

### **Tour 2: Koman Lake Cruise**
```json
{
  "title": "Koman Lake Cruise",
  "description": "Boat tour through the stunning Koman Lake",
  "price": 120.0,
  "departureTime": "09:30",
  "location": "Koman",
  "rating": 4.9,
  "image": "/koman .jpg",
  "maxGuests": 20,
  "routeDescription": "Peaceful cruise through crystal clear waters",
  "startLocationLink": "https://maps.google.com/?q=Koman,Albania",
  "highlights": ["Boat cruise", "Water activities", "Scenic photography"]
}
```

### **Tour 3: Valbona Valley Trek**
```json
{
  "title": "Valbona Valley Trek",
  "description": "Hiking adventure in Valbona National Park",
  "price": 180.0,
  "departureTime": "07:00",
  "location": "Valbona",
  "rating": 4.7,
  "image": "/valbona.jpg",
  "maxGuests": 12,
  "routeDescription": "Challenging trek with breathtaking views",
  "startLocationLink": "https://maps.google.com/?q=Valbona,Albania",
  "highlights": ["National park visit", "Wildlife watching", "Mountain climbing"]
}
```

### **Tour 4: Tirana City Tour**
```json
{
  "title": "Tirana City Tour",
  "description": "Discover the vibrant capital city",
  "price": 80.0,
  "departureTime": "10:00",
  "location": "Tirana",
  "rating": 4.5,
  "image": "/Tirana.webp",
  "maxGuests": 25,
  "routeDescription": "Urban exploration with historical sites",
  "startLocationLink": "https://maps.google.com/?q=Tirana,Albania",
  "highlights": ["City landmarks", "Historical sites", "Local markets"]
}
```

### **Tour 5: Shkodra Lake Experience**
```json
{
  "title": "Shkodra Lake Experience",
  "description": "Visit the largest lake in the Balkans",
  "price": 100.0,
  "departureTime": "08:30",
  "location": "Shkodra",
  "rating": 4.6,
  "image": "/ujvaraSh.jpg",
  "maxGuests": 18,
  "routeDescription": "Lakeside adventure with cultural sites",
  "startLocationLink": "https://maps.google.com/?q=Shkodra,Albania",
  "highlights": ["Lake activities", "Cultural heritage", "Nature walks"]
}
```

## 🔍 **Other Useful Endpoints**

### **GET /api/tours** - Get all tours
**URL**: `{{base_url}}/api/tours`

### **GET /api/tours/{id}** - Get specific tour
**URL**: `{{base_url}}/api/tours/1`

### **PUT /api/tours/{id}** - Update tour
**URL**: `{{base_url}}/api/tours/1`

### **DELETE /api/tours/{id}** - Delete tour
**URL**: `{{base_url}}/api/tours/1`

## 🎨 **Available Images**

Use these image paths in your tour data:
- `/tropojaFoto.jpg`
- `/koman .jpg`
- `/valbona.jpg`
- `/Tirana.webp`
- `/ujvaraSh.jpg`
- `/stoneHouse.jpg`
- `/liqeniXhemes.jpeg`
- `/fierza.jpg`
- `/hgj.jpg`
- `/imhj.jpeg`

## ✅ **Testing Steps**

1. **Start your backend** (should be running on port 8080)
2. **Open Postman**
3. **Create a new POST request** to `http://localhost:8080/api/tours`
4. **Add the JSON body** with tour data
5. **Send the request**
6. **Check the response** - should return the created tour
7. **Verify on frontend** - tour should appear on the website

## 🚨 **Important Notes**

- **Database is now empty** - no hardcoded tours
- **Add tours one by one** via Postman
- **Images must exist** in the `/public` folder
- **Backend must be running** for API calls to work
- **Use proper JSON format** with quotes around all strings 