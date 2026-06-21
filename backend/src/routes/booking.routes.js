import express from "express";

import {
    confirmBooking,
    getUserBookings,
}
from "../controllers/booking.controller.js";

const router =
    express.Router();

router.get(
    "/",
    getUserBookings
);

router.post(
    "/",
    confirmBooking
);

export default router;