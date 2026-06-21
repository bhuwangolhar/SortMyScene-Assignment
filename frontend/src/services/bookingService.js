import api from "./api";

export const confirmBooking = async (
reservationId
) => {
try {

    const response =
        await api.post(
            "/bookings",
            {
                reservationId,
            }
        );

    return response.data;

} catch (error) {

    throw new Error(
        error.response?.data?.message ||
        "Failed to confirm booking"
    );

}

};
