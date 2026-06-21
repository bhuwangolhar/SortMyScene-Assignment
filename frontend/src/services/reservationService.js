import api from "./api";

export const getAllReservations = async (userId) => {
    try {
        const response = await api.get("/reserve", {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to fetch reservations"
        );
    }
};

export const reserveSeats = async ({
userId,
eventId,
seatNumbers,
}) => {
try {

    const response =
        await api.post(
            "/reserve",
            {
                userId,
                eventId,
                seatNumbers,
            }
        );

    return response.data;

} catch (error) {

    throw new Error(
        error.response?.data?.message ||
        "Failed to reserve seats"
    );

}

};

export const cancelReservation = async (
    reservationId,
    eventId
) => {
    try {
        console.log("cancelReservation called with:", {
            reservationId,
            eventId,
            endpoint: "/reserve"
        });

        if (!reservationId || !eventId) {
            throw new Error("reservationId and eventId are required");
        }

        const response = await api.delete(
            "/reserve",
            {
                data: {
                    reservationId,
                    eventId,
                },
            }
        );

        console.log("Cancel reservation response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Cancel reservation error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to cancel reservation"
        );
    }
};
