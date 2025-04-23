import { Routes, Route } from "react-router-dom"
import { useState } from 'react'
import Error from "./Error"
import Events from "./Events"
import Login from "./Login"
import Header from "./Header"
import EventPage from "./EventPage"
import MyAccount from "./MyAccount"

function App() {

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element ={<Login />}></Route>
        <Route path="/events" element ={<Events />}></Route>
        <Route path="/events/:event_id" element={<EventPage />}></Route>
        <Route path="/myAccount" element={<MyAccount />}></Route>
        <Route path="*" element={<Error />}/>
      </Routes>
    </div>
  )
}

export default App
