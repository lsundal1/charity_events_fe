import { Routes, Route } from "react-router-dom"
import { useContext, useState } from 'react'
import Error from "./Error"
import Events from "./Events"
import Login from "./Login"
import Header from "./Header"
import EventPage from "./EventPage"
import MyAccount from "./MyAccount"
import { UserContext } from "../contexts/UserContext"

function App() {

  const [events, setEvents] = useState([])

  const { user } = useContext(UserContext)

  console.log(user)

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element ={<Login />}></Route>
        <Route path="/events" element ={<Events events={events} setEvents={setEvents} />}></Route>
        <Route path="/events/:event_id" element={<EventPage event={event}/>}></Route>
        <Route path="/myAccount" element={<MyAccount />}></Route>
        <Route path="*" element={<Error />}/>
      </Routes>
    </div>
  )
}

export default App
