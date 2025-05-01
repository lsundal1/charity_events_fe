import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Error = ({ message }) => {
    const location = useLocation();

    return (
    <div className="text text-3xl font-bold">
        <h1>Oops! Something went wrong.</h1>
        {message ? (
        <p><i>{message}</i></p>
        ) : (
        <p>No route matches the path: <i>{location.pathname}</i></p>
        )}
        <Link  className="link" to="/"><a>Go home</a></Link>
    </div>
    );
};

export default Error;
