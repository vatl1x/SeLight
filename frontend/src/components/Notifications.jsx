import { useState, useEffect } from "react";
import { api } from "../api";
import "./Notifications.css";

const SEV_META = {
    info: { icon: "ℹ️", cls: "sev-info" },
    warning: { icon: "⚠️", cls: "sev-warn" },
    error: { icon: "❌", cls: "sev-err" },
};

export default function Notifications() {
    const [notifs, setNotifs] = useState([]);
    const [filter, setFilter] = useState("all"); // all | unread
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const data = await api.getNotifications(filter === "unread");
            setNotifs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        load();
    }, [filter]);

    useEffect(() => {
        const t = setInterval(load, 8000);
        return () => clearInterval(t);
    }, [filter]);

    async function markRead(id) {
        await api.markRead(id);
        load();
    }

    async function readAll() {
        await api.readAll();
        load();
    }

    const unreadCount = notifs.filter((n) => !n.read).length;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Уведомления</h1>
                <div style={{ display: "flex", gap: 10 }}>
                    {unreadCount > 0 && (
                        <button className="btn btn-primary" onClick={readAll}>
                            Прочитать все ({unreadCount})
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={load}>
                        ↺
                    </button>
                </div>
            </div>

            <div className="notif-filters">
                <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    Все
                </button>
                <button
                    className={`filter-btn ${filter === "unread" ? "active" : ""}`}
                    onClick={() => setFilter("unread")}
                >
                    Непрочитанные
                </button>
            </div>

            {loading && <div className="notif-empty">Загрузка…</div>}

            {!loading && notifs.length === 0 && (
                <div className="notif-empty">🎉 Нет уведомлений</div>
            )}

            <div className="notif-list">
                {notifs.map((n) => {
                    const meta = SEV_META[n.severity] ?? SEV_META.info;
                    return (
                        <div
                            key={n.id}
                            className={`notif-item ${n.read ? "notif-read" : ""} ${meta.cls}`}
                        >
                            <span className="notif-icon">{meta.icon}</span>
                            <div className="notif-body">
                                <div className="notif-msg">{n.message}</div>
                                <div className="notif-meta">
                                    {n.device_id && (
                                        <span className="notif-device">
                                            {n.device_id}
                                        </span>
                                    )}
                                    <span>
                                        {new Date(n.timestamp).toLocaleString(
                                            "ru-RU",
                                        )}
                                    </span>
                                </div>
                            </div>
                            {!n.read && (
                                <button
                                    className="notif-read-btn"
                                    onClick={() => markRead(n.id)}
                                >
                                    Прочитано
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
