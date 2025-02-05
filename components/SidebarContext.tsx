"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
    activePage: string;
    setActivePage: (page: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [activePage, setActivePage] = useState<string>("dashboard");

    return (
        <SidebarContext.Provider value={{ activePage, setActivePage }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebarContext must be used within a SidebarProvider");
    }
    return context;
}
