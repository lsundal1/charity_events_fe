import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { fetchEventsByUserId } from "../../axios"
import EventCard from "./eventCard"

export default function MyAccount () {

    const { user } = useContext(UserContext)
    const [myEvents, setMyEvents] = useState([])
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchEventsByUserId(user.user_id).then(({data}) => {
            setIsLoading(false)
            setMyEvents(data.events)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [])

    console.log(myEvents)

    return (
        <div className="flex gap-6 px-4">
            <div className="card h-screen bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <div className="Avatar">
                    
                    <div className="mask mask-squircle w-34">
                        <img src={user.avatar} />
                    </div>
                        <h1 className="text-5xl font-bold">{user.user_name}</h1>
                    </div>
                </div>
            </div>
            
            <div className="flex-1">
                <h1 className="text-3xl font-bold">Your events:</h1>   
                <ul>
                    { myEvents.map((event) => (
                        <EventCard key={event.event_id} event={event} />
                    ))}
                </ul>
            </div>
        </div>
    )
}