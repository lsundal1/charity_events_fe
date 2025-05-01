import { Routes, Route, useLocation } from "react-router-dom"
import { useContext, useEffect } from 'react'
import { UserContext } from "../contexts/UserContext"
import Error from "./Error"
import Events from "./Events"
import Login from "./Login"
import Header from "./Header"
import EventPage1 from "./EventPage1"
import MyAccount from "./MyAccount"
import Footer from "./Footer"
import CreateEvent1 from "./CreateEvent1"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

function App() {

  const { pathname } = useLocation();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const publicPaths = ["/"];
    const isPublicPath = publicPaths.includes(pathname);
  
    if (isPublicPath) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [pathname, setUser]);

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor: "#d3d8eb"}}>
      <Header/>
      <main className="flex-1">
        <Routes>

          <Route path="/" element ={<Login />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/events" element ={<Events />}></Route>
            <Route path="/events/:event_id" element={<EventPage1 />}></Route>
            <Route path="/myAccount" element={<MyAccount />}></Route>
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/createEvent" element={<CreateEvent1 />} />
          </Route>

          <Route path="*" element={<Error />}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App
