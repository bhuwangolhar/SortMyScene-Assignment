import Event from "../models/event.model.js";
import Seat from "../models/seat.model.js";

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({
            dateTime: 1,
        });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        const seats = await Seat.find({
            eventId: id,
        }).sort({
            seatNumber: 1,
        });

        res.status(200).json({
            success: true,
            data: {
                event,
                seats,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};