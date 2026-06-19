import express from "express";

import {
    getAllEvents,
    getEventById,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

export default router;