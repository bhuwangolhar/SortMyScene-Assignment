import express from "express";

import {
    reserveSeats,
}
from "../controllers/reservation.controller.js";

const router = express.Router();

router.post(
    "/",
    reserveSeats
);

export default router;