import { Link } from "react-router-dom";

function EventCard({ event }) {

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow-sm
                border
                p-6
                hover:shadow-md
                transition
            "
        >

            <h2
                className="
                    text-2xl
                    font-semibold
                    mb-3
                "
            >
                {event.name}
            </h2>

            <p className="text-gray-600">
                📍 {event.venue}
            </p>

            <p className="text-gray-600 mt-2">
                🎟️ {event.totalSeats} Seats
            </p>

            <Link
                to={`/events/${event._id}`}
                className="
                    inline-block
                    mt-4
                    bg-indigo-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-indigo-700
                "
            >
                View Seats
            </Link>

        </div>

    );
}

export default EventCard;