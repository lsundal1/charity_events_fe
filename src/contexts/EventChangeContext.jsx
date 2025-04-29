import { createContext, useState } from "react";

export const EventChangeContext = createContext();

export const EventChangeProvider = ({ children }) => {
    const [event, setEvent] = useState(null);
    const [successInfo, setSuccessInfo] = useState(null);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEventChange = (deletedId, actionType = "delete") => {
        if (actionType === "delete") {
            setEvent(prev => {
                if (!prev) return null;
                return prev.event_id === deletedId ? null : prev;
            });
            setSuccessInfo({
                message: "Event deleted",
                type: "warning"
            });
        } else if (actionType === "create") {
            setSuccessInfo({
                message: "Your event has been created!",
                type: "success"
            });
            setRefreshKey(prev => prev + 1);
        }
        
        setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setSuccessInfo(null);
                setIsFadingOut(false);
            }, 500); 
        }, 2500);
    };

    return (
        <EventChangeContext.Provider value={{ 
            event, 
            setEvent,
            handleEventChange,
            successInfo,
            isFadingOut,
            refreshKey
        }}>
            {children}
        </EventChangeContext.Provider>
    );
};