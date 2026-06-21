import express from "express";

import {
    reserveSeats,
    getUserReservations,
}
from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/", getUserReservations);

router.post(
    "/",
    reserveSeats
);

export default router;