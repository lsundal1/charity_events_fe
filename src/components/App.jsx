import { Routes, Route } from "react-router-dom"
import { useState } from 'react'
import Error from "./Error"
import Events from "./Events"
import Login from "./Login"
import Header from "./Header"
import EventPage1 from "./EventPage1"
import MyAccount from "./MyAccount"
import Footer from "./Footer"
import CreateEvent1 from "./CreateEvent1"

function App() {

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: "#d3d8eb"}}>
      <Header/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element ={<Login />}></Route>
          <Route path="/events" element ={<Events />}></Route>
          <Route path="/events/:event_id" element={<EventPage1 />}></Route>
          <Route path="/myAccount" element={<MyAccount />}></Route>
          <Route path="/createEvent" element={<CreateEvent1 />}></Route> 
          <Route path="*" element={<Error />}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App
