import { useState } from "react";
import { api } from "../api";
import { AuthUser } from "../interfaces";

export const useAuth = () => {
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token"),
    );
    const [user, setUser] = useState<AuthUser | null>(null);

    async function login(newToken: string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        const me = await api.me();
        setUser(me);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return { token, user, login, logout };
};
