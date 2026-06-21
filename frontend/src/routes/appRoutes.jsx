import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import MyTickets from "../pages/MyTickets";

function AppRoutes() {

    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/events"
                element={<Events />}
            />

            <Route
                path="/events/:eventId"
                element={<EventDetails />}
            />

            <Route
                path="/my-tickets"
                element={<MyTickets />}
            />

        </Routes>
    );
}

export default AppRoutes;