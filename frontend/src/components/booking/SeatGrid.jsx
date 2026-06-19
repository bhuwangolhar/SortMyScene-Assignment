function SeatGrid({
    seats,
    selectedSeats,
    setSelectedSeats,
}) {

    const handleSeatClick = (seat) => {

        if (
            seat.status !== "available"
        ) {
            return;
        }

        const alreadySelected =
            selectedSeats.includes(
                seat.seatNumber
            );

        if (alreadySelected) {

            setSelectedSeats(
                selectedSeats.filter(
                    (s) =>
                        s !== seat.seatNumber
                )
            );

        } else {

            setSelectedSeats([
                ...selectedSeats,
                seat.seatNumber,
            ]);

        }
    };

    return (

        <div
            className="
                grid
                grid-cols-5
                gap-4
                mt-8
            "
        >

            {seats.map((seat) => {

                let color =
                    "bg-green-500";

                if (
                    seat.status ===
                    "reserved"
                ) {
                    color =
                        "bg-yellow-500";
                }

                if (
                    seat.status ===
                    "booked"
                ) {
                    color =
                        "bg-red-500";
                }

                const selected =
                    selectedSeats.includes(
                        seat.seatNumber
                    );

                return (

                    <button
                        key={seat._id}
                        onClick={() =>
                            handleSeatClick(
                                seat
                            )
                        }
                        className={`
                            ${color}
                            text-white
                            p-4
                            rounded-lg
                            font-semibold
                            transition
                            ${
                                selected
                                    ? "ring-4 ring-indigo-500"
                                    : ""
                            }
                        `}
                    >
                        {
                            seat.seatNumber
                        }
                    </button>

                );
            })}

        </div>

    );
}

export default SeatGrid;