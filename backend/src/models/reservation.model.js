import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
   userId: {
   type: String,
   required: true
},

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seatNumbers: [
      {
        type: String,
        required: true,
      },
    ],

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

export default Reservation;