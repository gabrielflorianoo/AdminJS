import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        // Pode colocar um spinner ou retornar null enquanto carrega
        return <div>Loading...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/" replace />;
}
