import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import EventDetails from "../pages/EventDetails";

function AppRoutes() {

    return (
        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/events/:eventId"
                element={<EventDetails />}
            />

        </Routes>
    );
}

export default AppRoutes;