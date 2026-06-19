import express from "express";
import cors from "cors";

import eventRoutes from "./routes/event.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/reserve",reservationRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SortMyScene API Running",
    });
});

export default app;