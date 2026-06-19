import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";

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

    await Reservation.findByIdAndDelete(
        reservationId
    );

    return {
        message:
            "Booking confirmed",
    };
};