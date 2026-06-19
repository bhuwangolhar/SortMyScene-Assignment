import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../services/eventService";
import SeatGrid from "../components/booking/SeatGrid";

function EventDetails() {
    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await getEventById(eventId);
            setEventData(response.data);
        } catch (error) {
            console.error("Failed to fetch event:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold">
                    Loading Event...
                </h2>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-red-500">
                    Event not found
                </h2>
            </div>
        );
    }

    const { event, seats } = eventData;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h1 className="text-4xl font-bold mb-4">
                    {event.name}
                </h1>

                <div className="space-y-2 text-gray-600">
                    <p>📍 {event.venue}</p>
                    <p>🎟️ {event.totalSeats} Seats</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-semibold mb-6">
                    Select Your Seats
                </h2>

                <SeatGrid
                    seats={seats}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                />

                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Selected Seats
                    </h3>

                    <p className="text-gray-600">
                        {selectedSeats.length > 0
                            ? selectedSeats.join(", ")
                            : "No seats selected"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;