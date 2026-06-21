import { useState, useEffect } from "react";
import { getAllEvents, getEventById } from "../services/eventService";

function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTickets: 0,
        reservedTickets: 0,
        bookedTickets: 0,
        expiredTickets: 0,
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const eventsResponse = await getAllEvents();
            const events = eventsResponse.data || [];
            const allTickets = [];

            // Fetch seats for all events in parallel instead of sequentially
            const eventDetailsPromises = events.map((event) =>
                getEventById(event._id).catch(() => ({ data: { seats: [] } }))
            );

            const eventDetailsResults = await Promise.all(eventDetailsPromises);

            // Process all results
            events.forEach((event, index) => {
                const eventData = eventDetailsResults[index];
                const seats = eventData.data?.seats || [];

                // Filter reserved and booked seats
                seats.forEach((seat) => {
                    if (seat.status === "reserved" || seat.status === "booked") {
                        allTickets.push({
                            _id: `${event._id}-${seat._id}`,
                            eventName: event.name || "Unknown Event",
                            venue: event.venue || "Unknown Venue",
                            seatNumber: seat.seatNumber,
                            status: seat.status,
                            eventDate: event.dateTime,
                        });
                    }
                });
            });

            setTickets(allTickets);

            // Calculate stats
            const reserved = allTickets.filter((t) => t.status === "reserved").length;
            const booked = allTickets.filter((t) => t.status === "booked").length;
            const expired = 0;

            setStats({
                totalTickets: allTickets.length,
                reservedTickets: reserved,
                bookedTickets: booked,
                expiredTickets: expired,
            });
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (ticketId) => {
        try {
            // TODO: Backend endpoint needed
            // DELETE /api/reservations/:reservationId
            // or POST /api/reservations/:reservationId/cancel

            // Temporary: remove from local state
            setTickets(tickets.filter((t) => t._id !== ticketId));
            
            // Recalculate stats
            const remainingTickets = tickets.filter((t) => t._id !== ticketId);
            const reserved = remainingTickets.filter((t) => t.status === "reserved").length;
            const booked = remainingTickets.filter((t) => t.status === "booked").length;
            
            setStats({
                totalTickets: remainingTickets.length,
                reservedTickets: reserved,
                bookedTickets: booked,
                expiredTickets: 0,
            });
            
            alert("Reservation cancelled successfully");
        } catch (error) {
            console.error("Failed to cancel reservation:", error);
            alert("Failed to cancel reservation");
        }
    };

    const handleViewTicket = (ticketId) => {
        // TODO: Implement ticket download/view functionality
        // Could open a PDF, show QR code, or navigate to ticket details
        alert("Ticket details - Feature coming soon");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                    <p className="mt-4 text-zinc-600">Loading your tickets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">My Tickets</h1>
                <p className="text-zinc-600">Manage your reservations and bookings</p>
            </div>

            {/* Statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Tickets" value={stats.totalTickets} color="violet" />
                <StatCard
                    label="Reserved"
                    value={stats.reservedTickets}
                    color="orange"
                />
                <StatCard label="Booked" value={stats.bookedTickets} color="emerald" />
                <StatCard label="Expired" value={stats.expiredTickets} color="zinc" />
            </section>

            {/* Tickets Table/Cards */}
            <section className="space-y-4">
                {tickets.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200 bg-zinc-50">
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Event
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Venue
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Seat
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-zinc-900">
                                            Event Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket._id}
                                            className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-zinc-900 font-medium">
                                                {ticket.eventName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600">
                                                {ticket.venue}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-900">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                                                    {ticket.seatNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <StatusBadge status={ticket.status} />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-600">
                                                {new Date(ticket.eventDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-4">
                            {tickets.map((ticket) => (
                                <TicketCard
                                    key={ticket._id}
                                    ticket={ticket}
                                    onCancel={handleCancelReservation}
                                    onView={handleViewTicket}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colorClasses = {
        violet: "bg-violet-50 text-violet-600 border-violet-200",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200",
        zinc: "bg-zinc-100 text-zinc-600 border-zinc-300",
    };

    return (
        <div className={`rounded-xl border p-6 ${colorClasses[color]}`}>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const badgeClasses = {
        reserved: "bg-orange-100 text-orange-700",
        booked: "bg-emerald-100 text-emerald-700",
        expired: "bg-zinc-100 text-zinc-700",
    };

    const statusLabel = {
        reserved: "Reserved",
        booked: "Booked",
        expired: "Expired",
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[status]}`}
        >
            {statusLabel[status]}
        </span>
    );
}

function TicketCard({ ticket, onCancel, onView }) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <div>
                <h3 className="font-semibold text-zinc-900">{ticket.eventName}</h3>
                <p className="text-sm text-zinc-600">{ticket.venue}</p>
                <p className="text-xs text-zinc-500 mt-1">
                    {new Date(ticket.eventDate).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-zinc-500 mb-2">Seat</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                        {ticket.seatNumber}
                    </span>
                </div>
                <StatusBadge status={ticket.status} />
            </div>

            <div className="flex gap-2">
                {ticket.status === "reserved" && (
                    <button
                        onClick={() => onCancel(ticket._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                {ticket.status === "booked" && (
                    <button
                        onClick={() => onView(ticket._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                    >
                        View Ticket
                    </button>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center">
            <svg
                className="mx-auto h-12 w-12 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">No tickets yet</h3>
            <p className="mt-1 text-zinc-600">
                You haven't made any reservations or bookings. Browse events to get started!
            </p>
        </div>
    );
}

export default MyTickets;
