import { useContext } from "react";
import Navbar from "./Navbar";
import { SidebarContext } from "../../context/SidebarContext";

function Layout({ children }) {
    const { isExpanded } = useContext(SidebarContext);

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            <Navbar />
            <main className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded ? "ml-64" : "ml-20"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default Layout;