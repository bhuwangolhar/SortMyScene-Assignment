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
