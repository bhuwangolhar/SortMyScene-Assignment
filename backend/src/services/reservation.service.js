import Seat from "../models/seat.model.js";
import Reservation from "../models/reservation.model.js";

export const reserveSeatsService = async ({
    userId,
    eventId,
    seatNumbers,
}) => {

    const availableSeats = await Seat.find({
        eventId,
        seatNumber: { $in: seatNumbers },
        status: "available",
    });

    if (availableSeats.length !== seatNumbers.length) {
        throw new Error(
            "One or more seats are no longer available"
        );
    }

    await Seat.updateMany(
        {
            eventId,
            seatNumber: { $in: seatNumbers },
        },
        {
            $set: {
                status: "reserved",
            },
        }
    );

    const reservation = await Reservation.create({
        userId,
        eventId,
        seatNumbers,

        expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
        ),
    });

    return reservation;
};