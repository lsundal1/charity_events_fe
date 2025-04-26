import { Link } from "react-router-dom"
import { EventContext } from "../contexts/EventContext";
import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { addAttendeeToEvent, removeAttendeeFromEvent, deleteEvent } from "../../axios";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdDirections } from "react-icons/md";

export default function EventCard ({ event, onEventChange }) {

  const { setEvent } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const [err, setErr] = useState(null)
  const [attendees, setAttendees] = useState(event.attendees || []);

  const formattedPostcode = event.postcode?.replace(/\s+/g, '+');

  const generateGoogleCalendarUrl = (event) => {
    const formatDate = (date) => encodeURIComponent(new Date(date).toISOString().replace(/-|:|\.\d\d\d/g,""));
  
    const start = formatDate(event.start_time);
    const end = formatDate(event.end_time);
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.postcode);
  
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  
  const startAndEnd = {
    date: startDate.toLocaleDateString('en-GB'), 
    start: startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    end: endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };

  const isAttending = attendees.some(a => a.user_id === user.user_id);

  useEffect(() => {
    setEvent(event) 
  }, [user])

  const handleSignUp = () => {
    addAttendeeToEvent(event.event_id, { user_id: user.user_id })
      .then(() => {
        setAttendees([...attendees, {
          user_id: user.user_id,
          avatar: user.avatar
        }]);
      }).then(() => {
        return document.getElementById('sign_up').showModal()
      })
      .catch((err) => {
        setErr(err.message);
      });
  };
  
  const handleCancelSignUp = () => {
    removeAttendeeFromEvent(event.event_id, { data: { user_id: user.user_id } })
      .then(() => {
        setAttendees(attendees.filter(a => a.user_id !== user.user_id));
      })
      .then(() => {
        return document.getElementById('cancel_sign_up').showModal()
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  const handleDeleteEvent = () => {
    
    deleteEvent(event.event_id)
      .then(() => {
        return onEventChange();
      })
      .catch((err) => {
        setErr(err.message);
      });
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
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500" />
          <span>{startAndEnd.date}: {startAndEnd.start} - {startAndEnd.end}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{event.postcode}</span>
        </div>
        <div className="flex items-center gap-2">
        <MdDirections className="text-gray-500"/>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${formattedPostcode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Get Directions
        </a>
        </div>
        <a
          href={generateGoogleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary mt-2"
        >
          Add to Google Calendar
        </a>
        <div className="avatar-group -space-x-6">
        {attendees.map((attendee) => {
            return <div key={attendee.user_id} className="avatar">
            <div className="w-12">
              <img src={attendee.avatar} />
            </div>
          </div>
          })
        }
        </div>
        <p><a>{isAttending? `You and ${event.attendees.length -1} other people are going to this event` : `${event.attendees.length} people are going to this event`}</a></p>
        {
          user.is_admin? <a className="link link-primary" onClick={() => document.getElementById('delete_event').showModal()}>Delete event</a> : null
        }
        <div className="card-actions justify-end">
          {
            !isAttending? <button className="btn btn-primary" onClick={handleSignUp}>Sign Up</button> : <button className="btn btn-secondary" onClick={handleCancelSignUp}>Cancel sign up</button>
          }
          
          <dialog id="sign_up" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Congrats!</h3>
              <p className="py-4">Thanks for signing up to this event.</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <dialog id="cancel_sign_up" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Sorry to see you go...</h3>
              <p className="py-4">You're no longer attending this event.</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn" onClick={e => onEventChange()}>Close</button>
                </form>
              </div>
            </div>
          </dialog>
          <dialog id="delete_event" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Are you sure?</h3>
              <p className="py-4">Are you sure you would like to delete this event?</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn mr-3" onClick={handleDeleteEvent}>Delete event</button>
                  <button className="btn">Cancel</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>  
    </div>
  )
}