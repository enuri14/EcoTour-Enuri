# EcoVenture Backend

A simple Node.js/Express API for the EcoVenture eco-tourism platform.

## Features
- Tour management (CRUD operations)
- Booking system
- In-memory database (for demo)
- CORS enabled for frontend integration

## API Endpoints

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get specific tour
- `POST /api/tours` - Create tour (admin only)
- `PUT /api/tours/:id` - Update tour (admin only)
- `DELETE /api/tours/:id` - Delete tour (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `POST /api/bookings` - Create booking

## Admin Access
Include header: `x-admin-secret: admin123`

## Local Development
```bash
npm install
npm start
```

Server runs on port 3000 (or PORT environment variable)

## Deploy to Render
1. Push this code to GitHub
2. Connect GitHub repo to Render
3. Deploy as Node.js web service