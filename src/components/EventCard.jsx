import { Link } from "react-router-dom"
import { EventContext } from "../contexts/EventContext";
import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { addAttendeeToEvent } from "../../axios";

export default function EventCard ({event}) {

  const { setEvent } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const [isAttending, setIsAttending] = useState(null)
  const [err, setErr] = useState(null)

  const attendingQuery = event.attendees.filter((attendee) => attendee.user_id === user.user_id)

  useEffect(() => {
    attendingQuery.length === 1? setIsAttending(true) : setIsAttending(false)
    console.log(attendingQuery)
  }, [user])

  const handleSignUp = () => {
    addAttendeeToEvent(event.event_id, {user_id: user.user_id}).then(() => {
    }).catch((err) => {
      setErr(err.message)
    })
  }

  const url = `/events/${event.event_id}`

  return (
    <div className="card bg-base-100 w-160 shadow-sm">
      <figure>
        <img 
          src={event.category_img}
          alt="category-img" />
      </figure>
      <div className="card-body">
        <div className="badge badge-primary">{event.city_name}</div>
        <h2 className="card-title"><Link className="link link-primary" to={url} onClick={(e) => setEvent(event)}>{event.title}</Link>
        </h2>
        <p>{event.description}</p>
        <div className="badge badge-soft badge-secondary">{event.category_name}</div>
        <p>Date: {event.date}</p>
        <p>Location: {event.postcode}</p>
        
        <div className="avatar-group -space-x-6">
        {event.attendees.map((attendee) => {
            return <div key={attendee.user_id} className="avatar">
            <div className="w-12">
              <img src={attendee.avatar} />
            </div>
          </div>
          })
        }
        </div>
        <p><a>{isAttending? "You and " : null}{event.attendees.length} people are going to this event</a></p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleSignUp} disabled={isAttending}>{isAttending? "Attending" : "Sign Up"}</button>
        </div>
      </div>
    </div>
  )
}