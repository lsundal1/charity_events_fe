import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { fetchUsers } from "../../axios";
import { useNavigate } from "react-router-dom";

export default function Login () {

    const [regularUsers, setRegularUsers] = useState([])
    const [adminUsers, setAdminUsers] = useState([])
    const [err, setErr] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    
    useEffect (() => {
        fetchUsers().then(({data}) => {
            setIsLoading(false)
            const admin = data.users.filter((user) => user.is_admin === true)
            const users = data.users.filter((user) => user.is_admin === false)
            setRegularUsers(users)
            setAdminUsers(admin)
            setSelectedUser(users[0])
            setErr(null)
        }).catch((err) => {
            setIsLoading(false)
            setErr(err.message)
        })
    }, [])

    const handleToggle = (e) => {
        const newIsAdmin = !isAdmin;
        setIsAdmin(newIsAdmin);
        
        if (newIsAdmin && adminUsers.length > 0) {
            setSelectedUser(adminUsers[0]);
        } else if (!newIsAdmin && regularUsers.length > 0) {
            setSelectedUser(regularUsers[0]);
        }
    };

    const handleLogin = () => {
        localStorage.setItem("user", JSON.stringify(selectedUser));
        setUser(selectedUser)
        navigate("/events")
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            { err? <div></div> : isLoading? <div></div> : <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">
                        Welcome to charity events, a place for you to find community events in your local area. This is a space for you to meet with like minded people and participate in volunteering for a good cause. Our group members also enjoy running together and socialising, so you're bound to find an event to suit you!</p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <fieldset className="fieldset">
                        
                        <legend className="fieldset-legend">Toggle to login as admin</legend>
                        <input type="checkbox" className="toggle" onChange={handleToggle}/>
                        <label className="label">User</label>
                        {isAdmin? 
                        <select className="select" onChange={(e) => {
                            const currentUser = adminUsers.find(user => user.user_id === Number(e.target.value));
                            setSelectedUser(currentUser);
                            }}>
                        { adminUsers.map((user) => {
                            return <option key={user.user_id} value={user.user_id}>{user.user_name}</option>
                        })}
                        </select> : <select className="select" onChange={(e) => {
                            const currentUser = regularUsers.find(user => user.user_id === Number(e.target.value));
                            setSelectedUser(currentUser);
                            }}>
                        { regularUsers.map((user) => {
                            return <option key={user.user_id} value={user.user_id}>{user.user_name}</option>
                        })}
                        </select>
                        }
                        <label className="label">Password</label>
                        <input type="input" disabled className="input" placeholder="Password" id="password" value={selectedUser? selectedUser.password : ""}/>
                        <button className="btn btn-neutral mt-4" onClick={handleLogin}>Login</button>
                        </fieldset>
                    </div>
                </div>
            </div>}
        </div>
    )
}