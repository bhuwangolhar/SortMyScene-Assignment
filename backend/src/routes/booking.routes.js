import express from "express";

import {
    confirmBooking,
}
from "../controllers/booking.controller.js";

const router =
    express.Router();

router.post(
    "/",
    confirmBooking
);

export default router;