# SortMyScene - Event Ticket Booking System

A full-stack event ticket booking platform that lets users browse events, select seats from an interactive theater-style layout, and complete a time-limited reservation before confirming a booking. Built with the MERN stack, with a focus on seat-level concurrency safety and a clear reservation-to-booking lifecycle.

## Features

- Browse available events
- Interactive seat selection
- Seat reservation system
- Booking confirmation
- Reservation expiry mechanism
- Live countdown timer
- Seat statistics dashboard
- Responsive UI
- Validation and error handling

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Architecture

```
Frontend (React + Vite)
        ↓
REST API (Express.js)
        ↓
MongoDB (Mongoose)
```

The backend follows a controller-service pattern, with business logic and validation isolated in the service layer. A background job runs on a fixed interval to release expired reservations back to the available pool.

## Folder Structure

```
SortMyScene/
├── backend/
│   └── src/
│       ├── models/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── jobs/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## API Endpoints

| Method | Endpoint           | Description                                  |
|--------|---------------------|-----------------------------------------------|
| GET    | `/api/events`       | Retrieve all available events                |
| GET    | `/api/events/:id`   | Retrieve a single event along with its seats |
| POST   | `/api/reserve`      | Reserve selected seats for 10 minutes        |
| POST   | `/api/bookings`     | Confirm a reservation and mark seats as booked |

## Reservation & Booking Flow

1. User selects one or more available seats
2. User clicks Reserve Seats
3. A reservation is created, valid for 10 minutes
4. A countdown timer starts on the reservation
5. User clicks Confirm Booking before the timer expires
6. Seats are marked as booked and the reservation is removed
7. Reservations left unconfirmed are automatically released by a background job

## Validation & Error Handling

- Required field validation on reservation and booking requests
- Empty seat selection is rejected
- Duplicate seat numbers in a single request are rejected
- Invalid seat format detection
- Non-existent seat detection
- Seat availability checks before a reservation is created
- Reservation expiry validation at booking confirmation
- Descriptive error responses surfaced in the UI

## Screenshots

**Home Page**
(Add Screenshot Here)

**Event Details Page**
(Add Screenshot Here)

**Seat Reservation Flow**
(Add Screenshot Here)

## Video Demonstration

Video Walkthrough: [Add Google Drive Link Here]

## Live Demo

Deployment Link: [Add Deployment Link Here]

## Local Setup Instructions

**Clone Repository**

```bash
git clone <repository-url>
cd SortMyScene
```

**Backend Setup**

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend

```bash
npm run dev
```

Seed Database

```bash
npm run seed
```

**Frontend Setup**

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend

```bash
npm run dev
```

## Future Improvements

- Authentication & authorization
- Real-time seat updates with WebSockets
- Payment gateway integration
- Booking history
- Admin dashboard

## Author

**Name:** Bhuvan Golhar