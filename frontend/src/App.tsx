import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login/Login";
import { AppLayout } from "./components/AppLayout/AppLayout";
import "./App.css";
import { useAuth } from "./hooks/useAuth";

export default function App() {
    const { token, user, login, logout } = useAuth();

    if (!token) {
        return <Login onLogin={login} />;
    }
    return (
        <BrowserRouter>
            <AppLayout onLogout={logout} user={user} />
        </BrowserRouter>
    );
}
