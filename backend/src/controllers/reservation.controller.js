import { reserveSeatsService }
from "../services/reservation.service.js";

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