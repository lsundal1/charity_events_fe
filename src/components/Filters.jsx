import { useContext, useEffect, useState } from 'react'
import { fetchCities } from '../../axios'
import { fetchCategories } from '../../axios'
import { UserContext } from '../contexts/UserContext'
import CreateEvent from './CreateEvent'
import { useSearchParams } from 'react-router-dom'


export default function Filters ({ order, setOrder, setCategory, setCity, onEventChange }) {

    const [cities, setCities] = useState([])
    const [categories, setCategories] = useState([])
    
    const [loading, setIsLoading] = useState(true)
    const [err, setErr] = useState(null)

    const [searchParams] = useSearchParams();

    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchCities().then(({data}) => {
            setCities(data.cities)
        }).then(() => {
            return fetchCategories()
        }).then(({data}) => {
            setCategories(data.categories)
        })
        .catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [])

    return ( 
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-xl font-bold">Filters</h1>
                <legend className="fieldset-legend">City</legend>
                <select className="select" onChange={e => setCity(e.target.value)}>
                    <option>All</option>
                    { cities.map((city) => {
                        return <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                    })}
                </select>
                    <legend className="fieldset-legend">Event type</legend>
                    <select className="select" onChange={e => setCategory(e.target.value)}>
                    <option>All</option>
                    { categories.map((category) => {
                        return <option key={category.category_id} value={category.category_id} >{category.category_name}</option>
                    })}
                </select>
                <legend className="fieldset-legend">Date</legend>

                <div className="flex items-center gap-4">
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={searchParams.get("order") === "DESC"}
                        onChange={() => {
                        const newOrder = searchParams.get("order") === "DESC" ? "ASC" : "DESC";
                        setOrder(newOrder);
                        }}
                    />
                    <span>
                        Desc
                    </span>
                </div>

                <br></br>

                {user.is_admin? <div className="drawer drawer-end">
                            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                                <div className="drawer-content">
                                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary w-max">Add new event</label>
                                </div>
                                <div className="drawer-side">
                                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                                    <ul className="menu bg-base-200 text-base-content min-h-full w-100 p-4">
                                    
                                    <CreateEvent onEventChange={onEventChange}/>
                                    </ul>
                                </div>
                            </div> : null}
            </div>
        </div>
    )

}