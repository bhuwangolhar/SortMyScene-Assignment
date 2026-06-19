const generateSeats = (eventId) => {
  const seats = [];

  const rows = ["A", "B", "C"];

  rows.forEach((row) => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        eventId,
        seatNumber: `${row}${i}`,
        status: "available",
      });
    }
  });

  return seats;
};

export default generateSeats;