
import { useContext } from "react"
import { EventContext } from "../contexts/EventContext"

export default function EventPage () {

    const { event } = useContext(EventContext);

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                src={event.category_img}
                className="max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                <h1 className="text-5xl font-bold">{event.title}</h1>
                <p className="py-6">
                    {event.description}
                </p>
                <button className="btn btn-primary">Sign up</button>
                </div>
            </div>

        </div>
    )
}