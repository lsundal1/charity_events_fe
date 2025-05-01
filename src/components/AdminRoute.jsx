import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const AdminRoute = () => {
    const { user, hasLoaded } = useContext(UserContext);

    if (!hasLoaded) return null;

    if (!user || !user.is_admin) {
        return <Navigate to="/events" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
