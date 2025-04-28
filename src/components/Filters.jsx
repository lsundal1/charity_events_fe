import { useContext, useEffect, useState } from 'react'
import { fetchCities } from '../../axios'
import { fetchCategories } from '../../axios'
import { UserContext } from '../contexts/UserContext'
import CreateEvent from './CreateEvent'
import { useSearchParams } from 'react-router-dom'


export default function Filters ({ setOrder, setCategory, setCity, onEventChange }) {

    const [cities, setCities] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setIsLoading] = useState(true)
    const [err, setErr] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [searchParams] = useSearchParams();

    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchCities().then(({data}) => {
            setCities(data.cities)
        }).then(() => {
            return fetchCategories()
        }).then(({data}) => {
            setCategories(data.categories)
            setIsLoading(false)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [])

    if (loading) return <div className="flex justify-center items-center h-screen w-full">
    <span className="loading loading-spinner loading-xl"></span>
    </div>;
    if (err) return <p>Error: {err}</p>;

    return (
        <div className="drawer drawer-end w-64 top self-start h-fit">
            
            <input id="event-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content">
                <div className="card-body">
                    <h1 className="text-xl font-bold">Filters</h1>
                    
                    <legend className="fieldset-legend">City</legend>
                    <select className="select select-bordered w-full" onChange={e => setCity(e.target.value)}>
                        <option>All</option>
                        {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                        ))}
                    </select>
                    
                    <legend className="fieldset-legend">Event type</legend>
                    <select className="select select-bordered w-full" onChange={e => setCategory(e.target.value)}>
                        <option>All</option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                        ))}
                    </select>
                    
                    <legend className="fieldset-legend">Date</legend>
                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            className="toggle"
                            checked={searchParams.get("order") === "DESC"}
                            onChange={() => {
                                const newOrder = searchParams.get("order") === "DESC" ? "ASC" : "DESC"
                                setOrder(newOrder)
                            }}
                        />
                        <span>Desc</span>
                    </div>
                    
                    <div className="mt-4">
                        <label 
                            htmlFor="event-drawer" 
                            className="btn btn-primary drawer-button"
                        >
                            Add new event
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="drawer-side z-50">
                <label htmlFor="event-drawer" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    <CreateEvent
                        onEventChange={onEventChange}
                        closeDrawer={() => {
                            document.getElementById('event-drawer').checked = false
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
