import Seat from "../models/seat.model.js";
import Reservation from "../models/reservation.model.js";

export const reserveSeatsService = async ({
    userId,
    eventId,
    seatNumbers,
}) => {

    // Normalize seat numbers

    const normalizedSeatNumbers =
        seatNumbers.map(
            (seat) =>
                seat.trim().toUpperCase()
        );

    // Duplicate seat validation

    const uniqueSeats =
        [...new Set(normalizedSeatNumbers)];

    if (
        uniqueSeats.length !==
        normalizedSeatNumbers.length
    ) {
        throw new Error(
            "Duplicate seat numbers are not allowed"
        );
    }

    // Seat format validation
    // Allowed:
    // A1-A10
    // B1-B10
    // C1-C10

    const seatPattern =
        /^[ABC](10|[1-9])$/;

    const invalidSeats =
        normalizedSeatNumbers.filter(
            (seat) =>
                !seatPattern.test(seat)
        );

    if (
        invalidSeats.length > 0
    ) {
        throw new Error(
            "Invalid seat format"
        );
    }

    // Fetch requested seats

    const seats = await Seat.find({
        eventId,
        seatNumber: {
            $in: normalizedSeatNumbers,
        },
    });

    // Seat existence validation

    const foundSeatNumbers =
        seats.map(
            (seat) =>
                seat.seatNumber
        );

    const missingSeats =
        normalizedSeatNumbers.filter(
            (seat) =>
                !foundSeatNumbers.includes(
                    seat
                )
        );

    if (
        missingSeats.length > 0
    ) {
        const seatLabel =
            missingSeats.length === 1
                ? "Seat"
                : "Seats";

        throw new Error(
            `${seatLabel} not found: ${missingSeats.join(", ")}`
        );
    }

    // Availability validation

    const unavailableSeats =
        seats.filter(
            (seat) =>
                seat.status !== "available"
        );

    if (
        unavailableSeats.length > 0
    ) {
        const unavailableSeatNumbers =
            unavailableSeats.map(
                seat => seat.seatNumber
            );

        const seatLabel =
            unavailableSeatNumbers.length === 1
                ? "Seat"
                : "Seats";

        throw new Error(
            `${seatLabel} unavailable: ${unavailableSeatNumbers.join(", ")}`
        );
    }

    // Reserve seats

    await Seat.updateMany(
        {
            eventId,
            seatNumber: {
                $in: normalizedSeatNumbers,
            },
        },
        {
            $set: {
                status: "reserved",
            },
        }
    );

    // Create reservation

    const reservation =
        await Reservation.create({
            userId,
            eventId,
            seatNumbers:
                normalizedSeatNumbers,

            expiresAt:
                new Date(
                    Date.now() +
                    10 * 60 * 1000
                ),
        });

    return reservation;
};