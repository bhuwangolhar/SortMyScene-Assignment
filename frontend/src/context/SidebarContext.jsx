import { createContext, useState } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
}
