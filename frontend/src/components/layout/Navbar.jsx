import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";

function Navbar() {
    const { isExpanded, setIsExpanded } = useContext(SidebarContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            path: "/",
            label: "Home",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4"
                    />
                </svg>
            ),
        },
        {
            path: "/events",
            label: "Events",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            path: "/my-tickets",
            label: "My Tickets",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 5v2m-4 4v2m4 0v2m-4-6v2m0 0h2m-2 0H9m9 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`fixed left-0 top-0 h-screen bg-white border-r border-zinc-200 shadow-lg transition-all duration-300 ease-in-out z-50 flex flex-col ${
                isExpanded ? "w-64" : "w-20"
            }`}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-center h-20 border-b border-zinc-200 flex-shrink-0">
                {isExpanded ? (
                    <Link to="/" className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <h1 className="text-lg font-bold text-zinc-900 truncate">
                            SortMyScene
                        </h1>
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                    </Link>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-4 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            isActive(item.path)
                                ? "bg-violet-50 text-violet-600"
                                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                        title={!isExpanded ? item.label : ""}
                    >
                        <span
                            className={`flex-shrink-0 ${
                                isActive(item.path) ? "text-violet-600" : "text-zinc-400 group-hover:text-zinc-600"
                            }`}
                        >
                            {item.icon}
                        </span>
                        {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Expand Indicator */}
            {!isExpanded && (
                <div className="px-3 pb-6 text-center">
                    <svg
                        className="w-5 h-5 text-zinc-300 mx-auto animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            )}
        </aside>
    );
}

export default Navbar;
