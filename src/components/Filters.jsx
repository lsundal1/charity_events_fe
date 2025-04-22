import { useEffect, useState } from 'react'
import { fetchCities } from '../../axios'
import { fetchCategories } from '../../axios'


export default function Filters ({ setOrder, setCategory, setCity }) {

    const [cities, setCities] = useState([])
    const [categories, setCategories] = useState([])
    
    const [loading, setIsLoading] = useState(true)
    const [err, setErr] = useState(null)

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
                <div className="flex items-center gap-2">
                    <input type="radio" name="radio-3" className="radio radio-neutral" defaultChecked value="ASC" onChange={(e) => setOrder(e.target.value)}/>
                    <p><a>Ascending</a></p>
                </div>
                <div className="flex items-center gap-2">
                    <input type="radio" name="radio-3" className="radio radio-neutral" value="DESC" onChange={(e) => setOrder(e.target.value)}/>
                    <p><a>Descending</a></p>
                </div>
                
            </div>
        </div>
    )

}