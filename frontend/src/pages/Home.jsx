import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents, getEventById } from "../services/eventService";

function Home() {
    const [stats, setStats] = useState({
        totalEvents: 0,
        availableSeats: 0,
        reservedSeats: 0,
        bookedSeats: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const eventsResponse = await getAllEvents();
            const events = eventsResponse.data || [];

            let totalSeats = 0;
            let reservedCount = 0;
            let bookedCount = 0;

            // Fetch seats for all events in parallel instead of sequentially
            const eventDetailsPromises = events.map((event) =>
                getEventById(event._id).catch(() => ({ data: { seats: [] } }))
            );

            const eventDetailsResults = await Promise.all(eventDetailsPromises);

            // Process all results
            eventDetailsResults.forEach((eventData) => {
                const seats = eventData.data?.seats || [];

                // Count total seats for this event
                totalSeats += seats.length;

                // Count reserved and booked seats
                seats.forEach((seat) => {
                    if (seat.status === "reserved") {
                        reservedCount++;
                    } else if (seat.status === "booked") {
                        bookedCount++;
                    }
                });
            });

            const availableSeats = totalSeats - reservedCount - bookedCount;

            setStats({
                totalEvents: events.length,
                availableSeats: availableSeats,
                reservedSeats: reservedCount,
                bookedSeats: bookedCount,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            // Keep default stats if fetch fails
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 sm:px-12 py-16 sm:py-24 text-white">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                        Discover Amazing Events Near You
                    </h1>
                    <p className="text-lg sm:text-xl text-violet-100 mb-8">
                        Book your favorite seats for concerts, conferences, and shows in seconds.
                    </p>
                    <Link
                        to="/events"
                        className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors"
                    >
                        Browse Events →
                    </Link>
                </div>
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />
            </section>

            {/* Statistics */}
            {!loading && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Events" value={stats.totalEvents} color="violet" />
                    <StatCard
                        label="Available Seats"
                        value={stats.availableSeats}
                        color="emerald"
                    />
                    <StatCard
                        label="Reserved Seats"
                        value={stats.reservedSeats}
                        color="orange"
                    />
                    <StatCard label="Booked Seats" value={stats.bookedSeats} color="zinc" />
                </section>
            )}

            {/* Promotional Banners */}
            <section className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                    Special Offers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PromoBanner
                        title="Mumbai Music Festival"
                        discount="30% Off"
                        color="from-pink-500 to-rose-500"
                    />
                    <PromoBanner
                        title="Tech Summit 2026"
                        discount="Early Bird"
                        color="from-blue-500 to-cyan-500"
                    />
                    <PromoBanner
                        title="Comedy Weekend"
                        discount="Buy 2, Get 1"
                        color="from-yellow-500 to-orange-500"
                    />
                    <PromoBanner
                        title="Startup Expo"
                        discount="Network Pass"
                        color="from-green-500 to-emerald-500"
                    />
                </div>
            </section>

            {/* CTA Section */}
            <section className="rounded-2xl bg-zinc-100 px-6 sm:px-12 py-12 sm:py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-4">
                    Ready to book?
                </h2>
                <p className="text-lg text-zinc-600 mb-8">
                    Browse our curated selection of events and secure your seats now.
                </p>
                <Link
                    to="/events"
                    className="inline-flex items-center px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
                >
                    Browse Events
                </Link>
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

function PromoBanner({ title, discount, color }) {
    return (
        <div
            className={`rounded-xl bg-gradient-to-r ${color} p-8 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
        >
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
            <p className="text-lg opacity-90">{discount}</p>
        </div>
    );
}

export default Home;