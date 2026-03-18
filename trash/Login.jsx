import { useState } from "react";
import { api } from "../api";
import "./Login.css";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
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

    return (
        <div className="login-wrap">
            <div className="login-card">
                <div className="login-logo">💡</div>
                <h1 className="login-title">S.E. Light</h1>
                <p className="login-subtitle">Smart Energy Lighting System</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Логин
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            autoFocus
                            required
                        />
                    </label>
                    <label>
                        Пароль
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </label>
                    {error && <div className="login-error">{error}</div>}
                    <button
                        className="btn btn-primary login-btn"
                        disabled={loading}
                    >
                        {loading ? "Вход…" : "Войти"}
                    </button>
                </form>

                {/* <div className="login-hint">
                    <span>
                        Demo: <strong>admin</strong> / <strong>admin123</strong>
                    </span>
                </div> */}
            </div>
        </div>
    );
}
