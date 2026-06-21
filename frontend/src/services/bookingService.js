import api from "./api";

export const getAllBookings = async (userId) => {
    try {
        const response = await api.get("/bookings", {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            "Failed to fetch bookings"
        );
    }
};

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
