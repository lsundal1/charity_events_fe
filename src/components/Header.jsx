import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { MdOutlineAdminPanelSettings } from "react-icons/md";


export default function Header () {

    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate('/');
        
    };
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                { user? <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><Link to="/events" >Events</Link></li>
                    <li><Link to="/myAccount">My Account</Link></li>
                    <li><button onClick={handleLogout}>Sign out</button></li>
                </ul>
                </div> : null}
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">Charity Events</a>
            </div>
            <div className="navbar-end">
            {user && (
                <div className="flex flex-col items-center gap-1"> {/* Stack vertically */}
                <div className="avatar">
                    <div className="mask mask-squircle w-24">
                    <img src={user.avatar} alt="User Avatar" />
                    </div>
                </div>
                {user.is_admin && (
                    <div className="badge badge-accent flex items-center gap-1">
                    <MdOutlineAdminPanelSettings className="text-sm" /> 
                    Admin
                    </div>
                )}
                </div>
            )}
            </div>
        </div>
    )
}