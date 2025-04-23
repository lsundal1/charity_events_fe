import { useEffect, useState } from "react"
import { fetchEvents } from "../../axios"
import { useSearchParams } from "react-router-dom"
import EventCard from "./eventCard"
import Filters from "./Filters"

export default function Events () {

    const [isLoading, setIsLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [events, setEvents] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
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
    }, [orderQuery, cityQuery, categoryQuery])

    return (
        <div className="flex gap-6 px-4"> 
            <div className="w-64 sticky top-20 self-start">
                <Filters setOrder={setOrder} setCategory={setCategory} setCity={setCity} />
            </div>
        <div className="flex-1">
        {
            err ? (
                <div>
                <h3>Sorry 😬 we're having a problem...</h3>
                <p>{err}</p>
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            ) : events.length === 0 ? (
                <div>
                    <h1 className="text-5xl font-bold">Sorry... no events match your filters!</h1>
                </div>
            ) : (
                <div>
                <ul>
                    {events.map((event) => (
                        <EventCard key={event.event_id} event={event} />
                    ))}
                </ul>
                </div>
            )
        }
        </div>
        </div>
    )
}