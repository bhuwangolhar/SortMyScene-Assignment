import express from "express";

import {
    reserveSeats,
    getUserReservations,
    cancelReservation,
}
from "../controllers/reservation.controller.js";

const router = express.Router();

// GET all reservations for a user
router.get("/", getUserReservations);

// POST to reserve seats
router.post("/", reserveSeats);

// DELETE to cancel a reservation
router.delete("/", cancelReservation);

export default router;