import { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService";
import EventCard from "../components/event/EventCard";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await getAllEvents();
            setEvents(response.data || []);
        } catch (error) {
            console.error(error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-zinc-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">
                    Available Events
                </h1>
                <p className="text-zinc-600">
                    Discover and book your favorite events
                </p>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-zinc-600">No events available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Events;
