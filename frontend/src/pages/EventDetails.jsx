import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getEventById } from "../services/eventService";
import { reserveSeats } from "../services/reservationService";
import { confirmBooking } from "../services/bookingService";
import SeatGrid from "../components/booking/SeatGrid";

// --- Inline icons (no external icon library, keeps this a single file) ---
function IconCalendar({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
    );
}

function IconPin({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
            <path d="M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12Z" />
            <circle cx="12" cy="9" r="2.5" />
        </svg>
    );
}

function IconTicket({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
            <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V9Z" />
            <path d="M9 4v16" strokeDasharray="2 3" />
        </svg>
    );
}

function IconAlert({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
            <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z" />
        </svg>
    );
}

function LegendItem({ swatchClass, label }) {
    return (
        <span className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${swatchClass}`} aria-hidden="true" />
            {label}
        </span>
    );
}

const SEAT_CHIP_TONES = {
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    zinc: "bg-zinc-100 text-zinc-600 ring-zinc-200",
};

function SeatChipList({ title, seatNumbers, tone, emptyMessage }) {
    return (
        <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {title} {seatNumbers.length > 0 ? `(${seatNumbers.length})` : ""}
            </h4>
            {seatNumbers.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2" aria-label={title}>
                    {seatNumbers.map((seat) => (
                        <li
                            key={seat}
                            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${SEAT_CHIP_TONES[tone]}`}
                        >
                            {seat}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-2 text-xs text-zinc-400">{emptyMessage}</p>
            )}
        </div>
    );
}

function EventDetails() {
    const { eventId } = useParams();

    const [eventData, setEventData] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reservation, setReservation] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [countdownTime, setCountdownTime] = useState("");

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    useEffect(() => {
        if (!reservation?.expiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiresAt = new Date(reservation.expiresAt).getTime();
            const timeDiff = expiresAt - now;

            if (timeDiff <= 0) {
                clearInterval(interval);
                setCountdownTime("00:00");
                setReservation(null);
                setSelectedSeats([]);
                setErrorMessage("Reservation expired");
                fetchEventDetails();
            } else {
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                setCountdownTime(
                    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [reservation]);

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

    const handleReserveSeats = async () => {
        if (selectedSeats.length === 0) return;

        setActionLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const data = await reserveSeats({
                userId: "demo-user",
                eventId,
                seatNumbers: selectedSeats,
            });

            if (!data?.reservation?._id) {
                throw new Error("Reservation was created but no reservation ID was returned.");
            }

            setReservation(data.reservation);
            setSuccessMessage(data.message || "Seats reserved successfully!");
            await fetchEventDetails();
        } catch (error) {
            setErrorMessage(error.message || "Failed to reserve seats");
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!reservation?._id) {
            setErrorMessage("No active reservation found. Please reserve your seats again.");
            return;
        }

        setActionLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const data = await confirmBooking(reservation._id);
            setSuccessMessage(data.message || "Booking confirmed successfully!");
            setSelectedSeats([]);
            setReservation(null);
            await fetchEventDetails();
        } catch (error) {
            setErrorMessage(error.message || "Failed to confirm booking");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
                aria-busy="true"
                aria-live="polite"
            >
                <span className="sr-only">Loading event details…</span>

                <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="h-3 w-24 rounded-full bg-zinc-200" />
                    <div className="mt-4 h-9 w-2/3 rounded-lg bg-zinc-200" />
                    <div className="mt-6 flex flex-wrap gap-4">
                        <div className="h-4 w-36 rounded bg-zinc-200" />
                        <div className="h-4 w-28 rounded bg-zinc-200" />
                        <div className="h-4 w-24 rounded bg-zinc-200" />
                    </div>
                </div>

                <div className="mt-6 animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mx-auto h-3 w-28 rounded-full bg-zinc-200" />
                    <div className="mt-8 grid grid-cols-6 gap-3 sm:grid-cols-10">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="aspect-square rounded-md bg-zinc-200" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <IconAlert className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-zinc-900">Event not found</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                        We couldn&apos;t load this event. It may have been removed, or the link is incorrect.
                    </p>
                    <button
                        type="button"
                        onClick={fetchEventDetails}
                        className="mt-6 inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const { event, seats } = eventData;
    const seatCount = selectedSeats.length;
    const reservedSeatNumbers = seats.filter((s) => s.status === "reserved").map((s) => s.seatNumber);
    const bookedSeatNumbers = seats.filter((s) => s.status === "booked").map((s) => s.seatNumber);
    const availableSeatCount = seats.filter((s) => s.status === "available").length;
    const reservedSeatCount = reservedSeatNumbers.length;
    const bookedSeatCount = bookedSeatNumbers.length;

    // Tries a few common field names for date/time since the original
    // component never rendered one — adjust to match your schema if needed.
    const rawDate = event.date || event.dateTime || event.eventDate;
    const formattedDate =
        rawDate && !Number.isNaN(new Date(rawDate).getTime())
            ? new Date(rawDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
            : "Date to be announced";

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero */}
                <header className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                        style={{ background: "linear-gradient(90deg, #7C3AED 0%, #C026D3 55%, #F97316 100%)" }}
                        aria-hidden="true"
                    />
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">
                        Event details
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                        {event.name}
                    </h1>

                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600">
                        <div className="flex items-center gap-2">
                            <IconCalendar className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            <dt className="sr-only">Date and time</dt>
                            <dd>{formattedDate}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconPin className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            <dt className="sr-only">Venue</dt>
                            <dd>{event.venue}</dd>
                        </div>
                        <div className="flex items-center gap-2">
                            <IconTicket className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                            <dt className="sr-only">Total seats</dt>
                            <dd>{event.totalSeats} seats</dd>
                        </div>
                    </dl>
                </header>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-stretch lg:gap-6 max-w-7xl mx-auto">
                    {/* Seat selection */}
                    <section
                        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3"
                        aria-labelledby="seat-selection-heading"
                    >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                            <h2 id="seat-selection-heading" className="text-xl font-semibold text-zinc-900 sm:text-2xl">
                                Select your seats
                            </h2>
                            <p className="text-sm text-zinc-500">Tap a seat to select or deselect it</p>
                        </div>

                        {/* Screen indicator */}
                        <div className="mt-8 flex flex-col items-center" aria-hidden="true">
                            <div
                                className="h-3 w-2/3 max-w-md rounded-[100%] sm:h-4"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0.04) 100%)",
                                    boxShadow: "0 12px 26px -12px rgba(124,58,237,0.5)",
                                }}
                            />
                            <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                                Screen
                            </span>
                        </div>

                        <div className="mt-8 flex justify-center overflow-x-auto pb-2">
                            <SeatGrid
                                seats={seats}
                                selectedSeats={selectedSeats}
                                setSelectedSeats={setSelectedSeats}
                            />
                        </div>

                        {/* Legend */}
                        <div
                            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-zinc-100 pt-6 text-xs text-zinc-600 sm:text-sm"
                            aria-label="Seat status legend"
                        >
                            <LegendItem swatchClass="bg-emerald-500" label="Available" />
                            <LegendItem swatchClass="bg-violet-600" label="Selected" />
                            <LegendItem swatchClass="bg-orange-400" label="Reserved" />
                            <LegendItem swatchClass="bg-zinc-300" label="Booked" />
                        </div>
                    </section>

                    {/* Booking summary */}
                    <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-6 lg:col-span-2 flex flex-col">
                        <h3 className="text-base font-semibold text-zinc-900">Your selection</h3>

                        {/* Seat Statistics */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <div className="flex-1 min-w-[calc(25%-0.5rem)] rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-center">
                                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                    Available
                                </p>
                                <p className="mt-1 text-lg font-semibold text-zinc-900">{availableSeatCount}</p>
                            </div>
                            <div className="flex-1 min-w-[calc(25%-0.5rem)] rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-center">
                                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                    Reserved
                                </p>
                                <p className="mt-1 text-lg font-semibold text-orange-600">{reservedSeatCount}</p>
                            </div>
                            <div className="flex-1 min-w-[calc(25%-0.5rem)] rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-center">
                                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                    Booked
                                </p>
                                <p className="mt-1 text-lg font-semibold text-zinc-500">{bookedSeatCount}</p>
                            </div>
                            <div className="flex-1 min-w-[calc(25%-0.5rem)] rounded-lg border border-violet-100 bg-violet-50 p-3 text-center">
                                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                    Selected
                                </p>
                                <p className="mt-1 text-lg font-semibold text-violet-600">{seatCount}</p>
                            </div>
                        </div>

                        {successMessage && (
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                            </div>
                        )}

                        <SeatChipList
                            title="Selected"
                            seatNumbers={selectedSeats}
                            tone="violet"
                            emptyMessage="No seats selected yet"
                        />
                        <SeatChipList
                            title="Reserved"
                            seatNumbers={reservedSeatNumbers}
                            tone="amber"
                            emptyMessage="No seats currently reserved"
                        />
                        <SeatChipList
                            title="Booked"
                            seatNumbers={bookedSeatNumbers}
                            tone="zinc"
                            emptyMessage="No seats booked yet"
                        />

                        {reservation && (
                            <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-violet-700">
                                            Reservation Active
                                        </p>
                                        <p className="mt-1 text-xs text-violet-600">
                                            Status: <span className="font-semibold">Reserved</span>
                                        </p>
                                    </div>
                                    {countdownTime && (
                                        <div className="text-right">
                                            <p className="text-xs text-violet-600">Expires in</p>
                                            <p className="mt-1 text-lg font-bold font-mono text-violet-700">
                                                {countdownTime}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {selectedSeats.length > 0 && (
                                    <div className="mt-3 border-t border-violet-200 pt-3">
                                        <p className="text-xs font-medium text-violet-600">Reserved Seats:</p>
                                        <ul className="mt-2 flex flex-wrap gap-1">
                                            {selectedSeats.map((seat) => (
                                                <li
                                                    key={seat}
                                                    className="rounded px-2 py-1 text-xs font-medium bg-violet-200 text-violet-700"
                                                >
                                                    {seat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedSeats.length > 0 && !reservation && (
                            <button
                                type="button"
                                onClick={handleReserveSeats}
                                disabled={actionLoading}
                                className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                            >
                                {actionLoading ? "Reserving..." : "Reserve Seats"}
                            </button>
                        )}

                        {reservation && (
                            <button
                                type="button"
                                onClick={handleConfirmBooking}
                                disabled={actionLoading}
                                className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                            >
                                {actionLoading ? "Confirming..." : "Confirm Booking"}
                            </button>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;