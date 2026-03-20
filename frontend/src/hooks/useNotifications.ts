import { useState, useEffect } from "react";
import { api } from "../api";
import { FilterType } from "../components/Notifications/Notifications.constants";

export interface Notification {
    id: number;
    message: string;
    severity: string;
    device_id: string | null;
    read: boolean;
    timestamp: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<FilterType>("all");
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const data = await api.getNotifications(filter === "unread") as Notification[];
            setNotifications(data);
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
        const interval = setInterval(load, 8000);
        return () => clearInterval(interval);
    }, [filter]);

    async function markRead(id: number) {
        await api.markRead(id);
        load();
    }

    async function readAll() {
        await api.readAll();
        load();
    }

    async function clearAll() {
        await api.clearNotifications();
        load();
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        filter,
        setFilter,
        loading,
        markRead,
        readAll,
        unreadCount,
        clearAll,
        load,
    };
};
