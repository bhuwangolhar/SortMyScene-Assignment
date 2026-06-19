import Reservation from "../models/reservation.model.js";
import Seat from "../models/seat.model.js";

const startReservationExpiryJob = () => {

    setInterval(async () => {

        try {

            const expiredReservations =
                await Reservation.find({
                    expiresAt: {
                        $lt: new Date(),
                    },
                });

            for (const reservation of expiredReservations) {

                await Seat.updateMany(
                    {
                        eventId:
                            reservation.eventId,

                        seatNumber: {
                            $in:
                                reservation.seatNumbers,
                        },

                        status: "reserved",
                    },
                    {
                        $set: {
                            status: "available",
                        },
                    }
                );

                await Reservation.findByIdAndDelete(
                    reservation._id
                );

                console.log(
                    `Expired reservation released: ${reservation._id}`
                );
            }

        } catch (error) {

            console.error(
                "Reservation Cleanup Error:",
                error.message
            );

        }

    }, 60 * 1000);
};

export default startReservationExpiryJob;