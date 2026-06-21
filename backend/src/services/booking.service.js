import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";
import Booking from "../models/booking.model.js";

export const confirmBookingService = async (
    reservationId
) => {

    const reservation =
        await Reservation.findById(
            reservationId
        );

    if (!reservation) {
        throw new Error(
            "Reservation not found"
        );
    }

    if (
        new Date() >
        reservation.expiresAt
    ) {
        throw new Error(
            "Reservation expired"
        );
    }

    await Seat.updateMany(
        {
            eventId:
                reservation.eventId,

            seatNumber: {
                $in:
                    reservation.seatNumbers,
            },
        },
        {
            $set: {
                status: "booked",
            },
        }
    );

    // Create booking record to track which user booked the seats
    await Booking.create({
        userId: reservation.userId,
        eventId: reservation.eventId,
        seatNumbers: reservation.seatNumbers,
    });

    await Reservation.findByIdAndDelete(
        reservationId
    );

    return {
        message:
            "Booking confirmed",
    };
};