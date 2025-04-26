import { useEffect, useState } from "react"
import { fetchEvents } from "../../axios"
import { useSearchParams } from "react-router-dom"
import EventCard from "./EventCard"
import Filters from "./Filters"

export default function Events () {

    const [isLoading, setIsLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [events, setEvents] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const [refreshKey, setRefreshKey] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);


    const handleEventChange = (deletedId) => {
        setEvents(prev => prev.filter(e => e.event_id !== deletedId));
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);  
        }, 3000);
    };

    const orderQuery = searchParams.get("order");
    const cityQuery = searchParams.get("city");
    const categoryQuery = searchParams.get("category");

    const setOrder = (direction) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("order", direction);
        setSearchParams(newParams);
    }

    const setCategory = (category_id) => {
        const newParams = new URLSearchParams(searchParams);
        category_id === "All" ? newParams.delete("category") : newParams.set("category", category_id);
        setSearchParams(newParams);
    }

    const setCity = (city_id) => {
        const newParams = new URLSearchParams(searchParams);
        city_id === "All" ? newParams.delete("city") : newParams.set("city", city_id);
        setSearchParams(newParams);
    }

    useEffect(() => {
        setIsLoading(true);
        setErr(null); 
        fetchEvents(searchParams).then(({data}) => {
            setIsLoading(false)
            setEvents(data.events)

        }).catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [orderQuery, cityQuery, categoryQuery, refreshKey])

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4">
        
        <div className="w-64 sticky top-20 self-start h-fit">
            <Filters setOrder={setOrder} setCategory={setCategory} setCity={setCity} onEventChange={() => setRefreshKey(prev => prev + 1)}/>
        </div>
    
        <div className="flex-1 flex flex-col items-center">

        {showSuccess && (
            <div role="alert" className="alert alert-warning w-full m-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Event deleted</span>
            </div>
            )}
            {err ? (
            <div className="mt-0"> 
                <h3>Sorry 😬 we're having a problem...</h3>
                <p>{err}</p>
            </div>
            ) : isLoading ? (
            <div className="flex justify-center items-center h-screen w-full">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
            ) : events.length === 0 ? (
            <div className="text-center w-full"> 
                <h1 className="text-5xl font-bold">Sorry... no events match your filters!</h1>
            </div>
            ) : (
            <div className="w-full max-w-4xl">
                <ul className="grid gap-4"> 
                    {events.map((event) => (
                    <EventCard key={event.event_id} event={event} onEventChange={handleEventChange}/>
                    ))}
                </ul>
            </div>
            )}

        </div>
        </div>
    )
}