import { Link, useNavigate, useLocation } from "react-router-dom"
import { EventContext } from "../contexts/EventContext";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";
import { addAttendeeToEvent, removeAttendeeFromEvent, deleteEvent } from "../../axios";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import { EventChangeContext } from "../contexts/EventChangeContext";

export default function EventCard ({ event, setEvents, setMyEvents }) {

  const { setEvent } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const [err, setErr] = useState(null)
  const [attendees, setAttendees] = useState(event.attendees || []);
  const { handleEventChange } = useContext(EventChangeContext) 

  const location = useLocation();

  const pathname = location.pathname;
  const isEventDetailPage = /^\/events\/\d+$/.test(pathname); 
  const isEventsPage = pathname === "/events"; 
  const isMyAccountPage = pathname === "/myAccount"
  
  const navigate = useNavigate();

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
        setMyEvents(setMyEvents.filter(e => e.event_id !== event.event_id))
      })
      .catch((err) => {
        setErr(err.message);
      });
  };

  const handleDeleteEvent = async () => {

    deleteEvent(event.event_id).then(() => {

      handleEventChange(event.event_id); 

      if (isEventsPage) {
        setEvents(prev => prev.filter(e => e.event_id !== event.event_id))
      }  
    
      if (isEventDetailPage) {
        navigate('/events', { replace: true })
      } 
      
      if (isMyAccountPage) {
        setMyEvents(prev => prev.filter(e => e.event_id !== event.event_id))
      }
    })
    .catch ((err) => {
      setErr(err.message);
    })
  };


  const url = `/events/${event.event_id}`

  return (
    <div className="w-full flex justify-center">
    {
      err ? (
          <div>
          <h3>Sorry 😬 we're having a problem...</h3>
          <p>{err}</p>
          </div>
      ) : (
        <div className={`card shadow-xl mb-3 bg-base-200 ${isEventDetailPage ? "w-full max-w-4xl" : "w-full max-w-2xl"}`}>
          <div className={isEventDetailPage ? "flex flex-col md:flex-row gap-6" : ""}>
          
          <div className={isEventDetailPage ? "w-full md:w-2/5" : "w-full"}>
            <img 
              src={event.category_img}
              alt="category-img"
              className={`w-full h-auto ${isEventDetailPage ? "md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none" : "rounded-t-lg"}`}
              aria-label="category-img"
            />
          </div>
      
          <div className={`card-body ${isEventDetailPage ? "md:w-3/5" : "p-4 w-full max-w-m"}`}>
            <div className="badge badge-primary">{event.city_name}</div>
              <h2 className="card-title" aria-label="Event title"><Link className={ isEventDetailPage? "text-4xl font-bold" : "link link-primary text-3xl"} to={url} onClick={(e) => setEvent(event)}>{event.title}</Link>
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
                    <img src={attendee.avatar} className="bg-amber-400 object-cover object-top w-full h-full"/>
                  </div>
                </div>
                })
              }
              </div>
              <p><a>{isAttending? `You and ${event.attendees.length -1} other people are going to this event` : `${event.attendees.length} people are going to this event`}</a></p>
              {
                user.is_admin? <a className="link link-primary" onClick={() => {document.getElementById(`delete_event_${event.event_id}`).showModal()}}>Delete event</a> : null
              }
              <div className="card-actions justify-end">
                {
                  !isAttending? <button type="button" className="btn btn-primary" onClick={handleSignUp}>Sign Up</button> : <button type="button" className="btn btn-secondary" onClick={() => document.getElementById(`cancel_sign_up_${event.event_id}`).showModal()}>Cancel sign up</button>
                }
              </div>
            </div>
          </div>  
        </div>
      )
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
    <dialog id={`cancel_sign_up_${event.event_id}`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sorry to see you go...</h3>
        <p className="py-4">You're no longer attending this event.</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleCancelSignUp}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
    <dialog id={`delete_event_${event.event_id}`} className="modal">
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
  )
}