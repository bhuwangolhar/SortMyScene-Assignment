import { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService";
import EventCard from "../components/event/EventCard";

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response =
                await getAllEvents();

            setEvents(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading Events...</h2>;
    }

return (

    <div>

        <h1
            className="
                text-4xl
                font-bold
                mb-8
            "
        >
            Available Events
        </h1>

        <div
            className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
            "
        >
            {events.map((event) => (
                <EventCard
                    key={event._id}
                    event={event}
                />
            ))}
        </div>

    </div>

);
}

export default Home;