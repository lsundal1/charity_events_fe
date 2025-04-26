import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { fetchEventsByUserId } from "../../axios"
import EventCard from "./EventCard"

export default function MyAccount () {

    const { user } = useContext(UserContext)
    const [myEvents, setMyEvents] = useState([])
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        fetchEventsByUserId(user.user_id).then(({data}) => {
            setIsLoading(false)
            setMyEvents(data.events)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [user.user_id, refreshKey])


    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div>
            { err? (
                <h1 className="text-3xl font-bold">We're having a problem... {err} </h1> 
            ) : isLoading? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            ) : (
            <div className="flex gap-6 px-4">
            <div className="card h-min bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                    <div className="Avatar">
                    
                    <div className="mask mask-squircle w-34">
                        <img src={user.avatar} />
                    </div>
                        <h1 className="text-5xl font-bold">{user.user_name}</h1>
                        <br></br>
                        { user.is_admin? <h2 className="text-2xl font-bold">Admin</h2> : null }
                    </div>
                </div>
            </div>
            
            <div className="flex-1">
                <h1 className="text-3xl font-bold mt-2 mb-2">My events:</h1>   
                <ul>
                    { myEvents.map((event) => (
                        <EventCard key={event.event_id} event={event} onEventChange={handleRefresh}/>
                    ))}
                </ul>
            </div> 
            </div>)
            }
        </div>
    )
}