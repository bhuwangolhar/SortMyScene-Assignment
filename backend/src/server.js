import dotenv from "dotenv";

import startReservationExpiryJob from "./jobs/reservationExpiryJob.js";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        startReservationExpiryJob();

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

startServer();