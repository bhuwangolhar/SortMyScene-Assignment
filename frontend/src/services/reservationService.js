import api from "./api";

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
