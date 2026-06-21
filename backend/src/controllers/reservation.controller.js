import { reserveSeatsService }
from "../services/reservation.service.js";
import Reservation from "../models/reservation.model.js";
import Event from "../models/event.model.js";
import Seat from "../models/seat.model.js";
import mongoose from "mongoose";

export const getUserReservations = async (
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

        const reservations = await Reservation.find({
            userId: userId.trim(),
        }).populate("eventId");

        return res.status(200).json({
            success: true,
            data: reservations,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch reservations",
        });
    }
};

export const reserveSeats = async (
    req,
    res
) => {
    try {

        const {
            userId,
            eventId,
            seatNumbers,
        } = req.body;

        // Required fields

        if (
            !userId ||
            !eventId ||
            !seatNumbers
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "userId, eventId and seatNumbers are required",
            });
        }

        // Empty strings

        if (
            typeof userId !== "string" ||
            !userId.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid userId is required",
            });
        }

        if (
            typeof eventId !== "string" ||
            !eventId.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid eventId is required",
            });
        }

        // Seat array validation

        if (
            !Array.isArray(
                seatNumbers
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "seatNumbers must be an array",
            });
        }

        if (
            seatNumbers.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please select at least one seat",
            });
        }

        // Empty seat values

        const hasInvalidSeat =
            seatNumbers.some(
                (seat) =>
                    typeof seat !==
                        "string" ||
                    !seat.trim()
            );

        if (hasInvalidSeat) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid seat number detected",
            });
        }

        const reservation =
            await reserveSeatsService({
                userId:
                    userId.trim(),
                eventId:
                    eventId.trim(),
                seatNumbers:
                    seatNumbers.map(
                        (seat) =>
                            seat.trim()
                    ),
            });

        return res.status(201).json({
            success: true,
            message:
                "Seats reserved successfully",
            reservation,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to reserve seats",
        });

    }
};

export const cancelReservation = async (
    req,
    res
) => {
    try {
        const {
            reservationId,
            eventId,
        } = req.body;

        if (!reservationId || !eventId) {
            return res.status(400).json({
                success: false,
                message:
                    "reservationId and eventId are required",
            });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(reservationId)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid reservation ID format",
            });
        }

        const reservation =
            await Reservation.findById(
                new mongoose.Types.ObjectId(reservationId)
            );

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message:
                    "Reservation not found",
            });
        }

        const seatNumbers =
            reservation.seatNumbers;

        // Release seats back to available
        await Seat.updateMany(
            {
                eventId: eventId.trim(),
                seatNumber: {
                    $in: seatNumbers,
                },
            },
            {
                status: "available",
            }
        );

        // Delete the reservation
        await Reservation.findByIdAndDelete(
            reservationId
        );

        return res.status(200).json({
            success: true,
            message:
                "Reservation cancelled successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to cancel reservation",
        });
    }
};