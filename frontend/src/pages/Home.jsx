import { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService";

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
            <h1>Available Events</h1>

            {events.map((event) => (
                <div key={event._id}>
                    <h2>{event.name}</h2>

                    <p>
                        Venue: {event.venue}
                    </p>

                    <p>
                        Seats:
                        {" "}
                        {event.totalSeats}
                    </p>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Home;