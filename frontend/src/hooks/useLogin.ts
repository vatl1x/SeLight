import { useState } from "react";
import { api } from "../api";

export const useLogin = (onLogin: (token: string) => void) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await api.login(username, password);
            onLogin(data.access_token);
        } catch {
            setError("Неверный логин или пароль");
        } finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        error,
        loading,
        handleSubmit,
    };
};
