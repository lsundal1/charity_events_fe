import { useContext, useEffect, useState } from "react"
import { UserContext } from "../contexts/UserContext"
import { fetchEventsByUserId } from "../../axios"
import EventCard from "./EventCard"
import { MdOutlineAdminPanelSettings } from "react-icons/md";

export default function MyAccount () {

    const { user } = useContext(UserContext)
    const [myEvents, setMyEvents] = useState([])
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const handleEventChange = (deletedId) => {
    setMyEvents(prev => prev.filter(e => e.event_id !== deletedId));
    };

    useEffect(() => {
        fetchEventsByUserId(user.user_id).then(({data}) => {
            setIsLoading(false)
            setMyEvents(data.events)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [user.user_id, myEvents])


    return (
        <div>
            { err? (
                <h1 className="text-3xl font-bold">We're having a problem... {err} </h1> 
            ) : isLoading? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-xl"></span>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 px-4">
                    <div className="lg:w-64 top-20 h-fit">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-4">
                        <div className="flex flex-col items-center">
                            <div className="mask mask-squircle w-34 h-34 bg-amber-400">
                            <img src={user.avatar} alt="User avatar" className="object-cover object-top w-full h-full"/>
                            </div>
                            <h1 className="text-2xl font-bold mt-2 text-center mb-3">{user.user_name}</h1>
                            {user.is_admin && (
                            <div className="badge badge-accent flex items-center gap-1">
                                <MdOutlineAdminPanelSettings className="text-sm" />Admin
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-4 w-full text-center lg:text-left">
                        My events:
                    </h1>
                    <div className="w-full max-w-4xl">
                        <ul className="space-y-4">
                        {myEvents.map((event) => (
                            <EventCard key={event.event_id} event={event} onEventChange={handleEventChange} myEvents={myEvents} setMyEvents={setMyEvents}/>
                        ))}
                        </ul>
                    </div>
                    </div>
                </div>
            )}
        </div>
    )
}