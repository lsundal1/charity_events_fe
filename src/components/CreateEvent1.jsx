import { useContext, useEffect, useState } from "react";
import { createEvent, fetchCategories, fetchCities } from "../../axios";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import { EventChangeContext } from "../contexts/EventChangeContext";

export default function CreateEvent1() {

    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [err, setErr] = useState(null);
    const [postcodeError, setPostcodeError] = useState("");
    const navigate = useNavigate();
    const { handleEventChange } = useContext(EventChangeContext)

    const [request, setRequest] = useState({
        city_id: "",
        title: "",
        category_id: "",
        date: "",
        start_time: "",
        end_time: "",
        postcode: "",
        description: ""
    });

    useEffect(() => {
        fetchCategories()
            .then(({ data }) => setCategories(data.categories))
            .then(() => fetchCities())
            .then(({ data }) => setCities(data.cities))
            .catch((err) => setErr(err.message));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleTimeChange = (time, field) => {
        if (!request.date) {
            setErr("Please select a date first");
            return;
        }
        
        const [hours, minutes] = time.split(':');
        const dateObj = new Date(request.date);
        dateObj.setHours(hours);
        dateObj.setMinutes(minutes);
        
        setRequest(prev => ({
            ...prev,
            [field]: dateObj.toISOString()
        }));
    };

    const validatePostcode = (postcode) => {
        const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
        return regex.test(postcode);
    };

    const handlePostcodeChange = (e) => {
        const value = e.target.value;
        setRequest(prev => ({ ...prev, postcode: value }));
        
        if (value && !validatePostcode(value)) {
            setPostcodeError("Please enter a valid UK postcode");
        } else {
            setPostcodeError("");
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        
        if (!request.title || !request.description || !request.category_id || 
            !request.city_id || !request.postcode || !request.date || 
            !request.start_time || !request.end_time) {
            setErr("Please fill in all required fields");
            return;
        }
        
        if (postcodeError) {
            setErr("Please fix the postcode error");
            return;
        }
        
        if (new Date(request.end_time) <= new Date(request.start_time)) {
            setErr("End time must be after start time");
            return;
        }

        try {
            await createEvent({
                ...request,
                start_time: request.start_time,
                end_time: request.end_time
            });
            
            setRequest({
                city_id: "",
                title: "",
                category_id: "",
                date: "",
                start_time: "",
                end_time: "",
                postcode: "",
                description: ""
            });

            handleEventChange(null, "create");

            navigate("/events")

            setErr(null);
            
        } catch (error) {
            setErr(error.message || "Failed to create event");
        }
    };

    return (
        <div>
        <button onClick={() => {navigate(-1)}} className="ml-2 flex gap-1"><IoIosCloseCircle size={22}/>Close</button>
        <div className="p-4 max-w-md mx-auto">
            {err && <div className="alert alert-error mb-4">{err}</div>}
            
            <form onSubmit={handleCreateEvent}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-6 space-y-4">
                    <legend className="fieldset-legend text-lg font-semibold">Event details</legend>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="input input-bordered w-full"
                            placeholder="Event title"
                            value={request.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered w-full  "
                            placeholder="Event description"
                            value={request.description}
                            onChange={handleInputChange}
                            required
                            aria-label="Event title"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Category</span>
                        </label>
                        <select
                            name="category_id"
                            className="select select-bordered w-full  "
                            value={request.category_id}
                            onChange={handleInputChange}
                            required
                            aria-label="Select a category"
                        >
                            <option value="">Pick a category</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">City</span>
                        </label>
                        <select
                            name="city_id"
                            className="select select-bordered w-full  "
                            value={request.city_id}
                            onChange={handleInputChange}
                            required
                            aria-label="Select a city"
                        >
                            <option value="">Pick a city</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Postcode</span>
                        </label>
                        <input
                            type="text"
                            name="postcode"
                            className={`input input-bordered w-full ${postcodeError ? 'input-error' : ''}`}
                            placeholder="e.g. SW1A 1AA"
                            value={request.postcode}
                            onChange={handlePostcodeChange}
                            required
                            aria-label="Select postcode"
                        />
                        {postcodeError && (
                            <label className="label">
                                <span className="label-text-alt text-error">{postcodeError}</span>
                            </label>
                        )}
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Event Date</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            className="input input-bordered w-full"
                            value={request.date}
                            onChange={handleInputChange}
                            required
                            aria-label="Select date"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Start Time</span>
                            </label>
                            <input
                                type="time"
                                className="input input-bordered w-full"
                                onChange={(e) => handleTimeChange(e.target.value, 'start_time')}
                                required
                                aria-label="Select start time"
                            />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">End Time</span>
                            </label>
                            <input
                                type="time"
                                className="input input-bordered w-full"
                                onChange={(e) => handleTimeChange(e.target.value, 'end_time')}
                                required
                                aria-label="Select end time"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="btn btn-primary w-full" aria-label="Create event">
                            Create event
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
        </div>
    );
}