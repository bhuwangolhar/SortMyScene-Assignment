import { reserveSeatsService }
from "../services/reservation.service.js";

export const reserveSeats = async (
    req,
    res
) => {
    try {
        const reservation =
            await reserveSeatsService(
                req.body
            );

        res.status(201).json({
            success: true,
            message:
                "Seats reserved successfully",
            reservation,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};