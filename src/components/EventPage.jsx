import { useContext, useEffect, useState, React } from "react";
import { UserContext } from "../contexts/UserContext";
import { useParams } from "react-router-dom";
import { fetchEventByEventId } from "../../axios";
import { addAttendeeToEvent, removeAttendeeFromEvent } from "../../axios";
import MapComponent from "./Map";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EventPage() {
    const { user } = useContext(UserContext);
    const { event_id } = useParams();
    const [event, setEvent] = useState(null);
    const [err, setErr] = useState(null);
    const [isAttending, setIsAttending] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        fetchEventByEventId(event_id)
            .then(({ data }) => {
                setEvent(data.event);
                setAttendees(data.event.attendees || []);
                const isAttendingQuery = data.event.attendees.some(
                    (attendee) => attendee.user_id === user.user_id
                );
                setIsAttending(isAttendingQuery);
            })
            .catch((err) => {
                setErr(err.message);
            });
    }, [event_id, user.user_id]);

    const generateGoogleCalendarUrl = (event) => {
        const formatDate = (date) => encodeURIComponent(new Date(date).toISOString().replace(/-|:|\.\d\d\d/g,""));
        const start = formatDate(event.start_time);
        const end = formatDate(event.end_time);
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.postcode);
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    };

    const handleSignUp = () => {
        addAttendeeToEvent(event.event_id, { user_id: user.user_id })
        .then(() => {
                setAttendees([...attendees, {
                user_id: user.user_id,
                avatar: user.avatar 
                }]);
                setIsAttending(true);
            })
            .catch((err) => {
                setErr(err.message);
            });
    };
    
    const handleCancelSignUp = () => {
        removeAttendeeFromEvent(event.event_id, { data: { user_id: user.user_id } })
        .then(() => {
            setAttendees(attendees.filter(a => a.user_id !== user.user_id));
            setIsAttending(false);
            })
            .catch((err) => {
                setErr(err.message);
            });
    };

    const formatEventDates = (event) => {
        if (!event) return null;
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);
        
        return {
            date: startDate.toLocaleDateString('en-GB'), 
            start: startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            end: endDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };
    };

    
    return (
            <div className="hero bg-base-200 min-h-screen">
            { err? <h1 className="text-5xl font-bold">Error: {err}</h1> : !event? <div className="flex justify-center items-center h-screen">
                            <span className="loading loading-spinner loading-xl"></span>
                        </div> :  
            <div>
                <button className="btn btn-primary mt-3" onClick={() => {navigate(-1)}}>Back</button>
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                    src={event.category_img}
                    className="max-w-sm rounded-lg shadow-2xl"
                    alt="Event"
                    />
                    <div>
                        <div className="badge badge-primary">{event.city_name}</div>
                        <h1 className="text-5xl font-bold">{event.title}</h1>
                        <p className="py-6">{event.description}</p>
                        <div className="badge badge-soft badge-secondary mb-2">{event.category_name}</div>
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-500" />
                            <span>{formatEventDates(event).date}: {formatEventDates(event).start} - {formatEventDates(event).end}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <FaMapMarkerAlt className="text-gray-500" />
                            <span>{event.postcode}</span>
                        </div>

                        {!isAttending ? (
                            <button className="btn btn-primary" onClick={handleSignUp}>
                            Sign Up
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleCancelSignUp}>
                            Cancel sign up
                            </button>
                        )}
                    </div>

                </div> 
                {attendees.map((attendee) => {
                    return <div key={attendee.user_id} className="avatar">
                    <div className="w-12">
                    <img src={attendee.avatar} />
                    </div>
                </div>
                })
                }
                <p><a>{isAttending? `You and ${attendees.length -1} other people are going to this event` : `${attendees.length} people are going to this event`}</a></p>
                <a
                href={generateGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary mt-2"
                >
                Add to Google Calendar
                </a>
                
                <div className="mt-6 mb-6">
                    <h1 className="font-bold text-3xl">Event Location: </h1>
                    <MapComponent postcode={event.postcode} />
                </div>
            </div>
            }
            </div>
    );
}
