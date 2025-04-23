import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://charity-events-be.onrender.com/api",
    timout: 5000,
})

export function fetchEvents (obj) {
    return apiClient.get('/events', {params: obj})
}

export function fetchEventByEventId (event_id) {
    return apiClient.get(`/events/${event_id}`)
}

export function fetchCities () {
    return apiClient.get('/cities')
}

export function fetchCategories() {
    return apiClient.get('/categories')
}

export function fetchUsers() {
    return apiClient.get('/users')
}

export function fetchUser(user_id) {
    return apiClient.get(`/users/${user_id}`)
}

export function fetchEventsByUserId(user_id) {
    return apiClient.get(`/users/${user_id}/events`)
}

export function addAttendeeToEvent(event_id, obj) {
    return apiClient.post(`/events/${event_id}/attendees`, obj)
}

export function removeAttendeeFromEvent(event_id, obj) {
    return apiClient.delete(`/events/${event_id}/attendees`, obj)
}