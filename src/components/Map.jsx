import { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapComponent({ postcode }) {
    const [location, setLocation] = useState(null);
    const [viewState, setViewState] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 10
    });

    useEffect(() => {
        const fetchCoordinates = async () => {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode}.json?access_token=pk.eyJ1IjoibHN1bmRhbCIsImEiOiJjbTNlYWdzNTUwY3RmMmpxeWR0cTd0dXkzIn0.ZfncDcZMtoTW4Mu0gP8oxg`);
        const data = await response.json();
        if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            setLocation([lng, lat]);
            setViewState({
            latitude: lat,
            longitude: lng,
            zoom: 12
            });
        }
        };

        fetchCoordinates();
    }, [postcode]);

    if (!location) return <div>Loading Map...</div>;

    return (
        <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '400px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1IjoibHN1bmRhbCIsImEiOiJjbTNlYWdzNTUwY3RmMmpxeWR0cTd0dXkzIn0.ZfncDcZMtoTW4Mu0gP8oxg"
        >
        <Marker latitude={location[1]} longitude={location[0]}>
            <div>📍</div>
        </Marker>
        </Map>
    );
}
