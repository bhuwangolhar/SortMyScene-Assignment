import api from "./api";

export const getAllEvents = async () => {
    const response = await api.get("/events");
    return response.data;
};

export const getEventById = async (eventId) => {
    const response = await api.get(
        `/events/${eventId}`
    );

    return response.data;
};