import mongoose from "mongoose";
import dotenv from "dotenv";

import Event from "../models/event.model.js";
import Seat from "../models/seat.model.js";

import connectDB from "../config/db.js";
import generateSeats from "../utils/generateSeats.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log("Cleaning existing data...");

        await Seat.deleteMany({});
        await Event.deleteMany({});

        const events = await Event.insertMany([
            {
                name: "Rock Concert",
                venue: "Mumbai Arena",
                dateTime: new Date("2026-07-15T19:00:00"),
                totalSeats: 30,
            },
            {
                name: "Comedy Night",
                venue: "Pune Auditorium",
                dateTime: new Date("2026-07-20T20:00:00"),
                totalSeats: 30,
            },
            {
                name: "Tech Meetup",
                venue: "Bangalore Convention Center",
                dateTime: new Date("2026-07-25T10:00:00"),
                totalSeats: 30,
            },
        ]);

        let allSeats = [];

        events.forEach((event) => {
            allSeats.push(...generateSeats(event._id));
        });

        await Seat.insertMany(allSeats);

        console.log("Database seeded successfully!");

        console.log(
            `${events.length} events created`
        );

        console.log(
            `${allSeats.length} seats created`
        );

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();