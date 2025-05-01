import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = () => {
    const { user, hasLoaded } = useContext(UserContext);

    if (!hasLoaded) return null;

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;