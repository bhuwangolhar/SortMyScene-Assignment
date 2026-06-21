import { useMemo } from "react";

const ROW_PATTERN = /^([A-Za-z]+)(\d+)$/;
const SEATS_PER_AISLE_GROUP = 5;
const FALLBACK_SEATS_PER_ROW = 10;

function indexToRowLabel(index) {
    let label = "";
    let n = index;
    do {
        label = String.fromCharCode(65 + (n % 26)) + label;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return label;
}

function groupSeatsIntoRows(seats) {
    if (!seats || seats.length === 0) return [];

    const looksRowLabeled = seats.every((seat) => ROW_PATTERN.test(String(seat.seatNumber)));

    if (looksRowLabeled) {
        const rowMap = new Map();

        seats.forEach((seat) => {
            const [, letters, digits] = String(seat.seatNumber).match(ROW_PATTERN);
            const rowLabel = letters.toUpperCase();
            if (!rowMap.has(rowLabel)) rowMap.set(rowLabel, []);
            rowMap.get(rowLabel).push({ seat, order: parseInt(digits, 10) });
        });

        return Array.from(rowMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, entries]) => ({
                label,
                seats: entries.sort((a, b) => a.order - b.order).map((e) => e.seat),
            }));
    }

    // Fallback for plain numbered seats (1, 2, 3 ...): chunk sequentially
    // into synthetic rows so the theatre layout still works.
    const rows = [];
    for (let i = 0; i < seats.length; i += FALLBACK_SEATS_PER_ROW) {
        rows.push(seats.slice(i, i + FALLBACK_SEATS_PER_ROW));
    }
    return rows.map((rowSeats, index) => ({
        label: indexToRowLabel(index),
        seats: rowSeats,
    }));
}

function chunkForAisle(rowSeats) {
    const chunks = [];
    for (let i = 0; i < rowSeats.length; i += SEATS_PER_AISLE_GROUP) {
        chunks.push(rowSeats.slice(i, i + SEATS_PER_AISLE_GROUP));
    }
    return chunks;
}

function getSeatAppearance(status, selected) {
    if (selected) {
        return {
            classes: "bg-violet-600 text-white shadow-lg shadow-violet-600/50 ring-2 ring-violet-300 hover:bg-violet-700 hover:shadow-xl",
            disabled: false,
        };
    }
    if (status === "reserved") {
        return {
            classes: "bg-orange-400 text-white border-2 border-orange-600 opacity-80 cursor-not-allowed",
            disabled: true,
        };
    }
    if (status === "booked") {
        return {
            classes: "bg-zinc-300 text-zinc-400 opacity-40 border border-zinc-400",
            disabled: true,
        };
    }
    return {
        classes: "bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm hover:shadow-md",
        disabled: false,
    };
}

function SeatGrid({ seats, selectedSeats, setSelectedSeats }) {
    const handleSeatClick = (seat) => {
        if (seat.status !== "available") {
            return;
        }

        const alreadySelected = selectedSeats.includes(seat.seatNumber);

        if (alreadySelected) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seat.seatNumber]);
        }
    };

    const rows = useMemo(() => groupSeatsIntoRows(seats), [seats]);

    if (rows.length === 0) {
        return (
            <p className="py-10 text-center text-sm text-zinc-400">
                No seats available for this event.
            </p>
        );
    }

    return (
        <div className="flex w-max min-w-full flex-col items-center gap-2 sm:gap-2.5 md:gap-3">
            {rows.map((row) => {
                const aisleChunks = chunkForAisle(row.seats);

                return (
                    <div key={row.label} className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                        <span className="w-4 shrink-0 text-center text-xs font-semibold text-zinc-400 sm:w-5 md:w-6 md:text-sm">
                            {row.label}
                        </span>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {aisleChunks.map((chunk, chunkIndex) => (
                                <div
                                    key={chunkIndex}
                                    className={`flex gap-1.5 sm:gap-2 md:gap-2.5 ${chunkIndex > 0 ? "ml-2 sm:ml-3 md:ml-4 lg:ml-6" : ""}`}
                                >
                                    {chunk.map((seat) => {
                                        const selected = selectedSeats.includes(seat.seatNumber);
                                        const { classes, disabled } = getSeatAppearance(seat.status, selected);

                                        return (
                                            <button
                                                key={seat._id}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => handleSeatClick(seat)}
                                                aria-label={`Seat ${seat.seatNumber}, ${selected ? "selected" : seat.status}`}
                                                aria-pressed={selected}
                                                className={`
                                                    aspect-square w-7 shrink-0 rounded-md text-[10px] font-bold
                                                    transition-all duration-200 ease-in-out
                                                    sm:w-8 sm:text-xs md:w-9 md:text-sm lg:w-10
                                                    ${classes}
                                                    ${
                                                        disabled
                                                            ? "cursor-not-allowed"
                                                            : "cursor-pointer hover:scale-125 active:scale-90"
                                                    }
                                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                                                `}
                                            >
                                                {seat.seatNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <span
                            className="w-4 shrink-0 text-center text-xs font-semibold text-zinc-400 sm:w-5 md:w-6 md:text-sm"
                            aria-hidden="true"
                        >
                            {row.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default SeatGrid;