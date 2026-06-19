import {
    confirmBookingService,
}
from "../services/booking.service.js";

export const confirmBooking =
async (req, res) => {

    try {

        const {
            reservationId,
        } = req.body;

        const result =
            await confirmBookingService(
                reservationId
            );

        res.status(200).json({
            success: true,
            ...result,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message:
                error.message,
        });

    }
};