import { useContext, useEffect, useState } from "react";
import { EventContext } from "../contexts/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventByEventId } from "../../axios";
import EventCard from "./EventCard";
import MapComponent from "./Map";

export default function EventPage1() {

    const navigate = useNavigate();
    const { event, setEvent } = useContext(EventContext)
    const { event_id } = useParams();
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        window.scrollTo(0, 0);
        
        fetchEventByEventId(event_id).then(({data}) => {
            setIsLoading(false)
            setEvent(data.event)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [event_id])

    return (
        <div>
            { err?(
                <div aria-label="Error message">Sorry, we're having a problem... {err}</div>
            ) : isLoading? (
                <div className="flex justify-center items-center h-screen" aria-label="Loading">
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            ) : (
                <div> 
                    <button className="btn btn-primary m-3" onClick={() => {navigate(-1)}} aria-label="back-button">Back</button>
                    <div className="flex flex-col items-center">
                        <EventCard key={event.event_id} event={event}></EventCard>
                    </div>
                    <div className="mt-6 mb-6">
                        <h1 className="font-bold text-3xl">Event Location: </h1>
                        <MapComponent postcode={event.postcode} />
                    </div>
                </div>
            )}
        </div>
    )
}