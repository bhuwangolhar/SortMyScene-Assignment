import {
    confirmBookingService,
}
from "../services/booking.service.js";
import Booking from "../models/booking.model.js";

export const getUserBookings = async (
    req,
    res
) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId query parameter is required",
            });
        }

        const bookings = await Booking.find({
            userId: userId.trim(),
        }).populate("eventId");

        return res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to fetch bookings",
        });
    }
};

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