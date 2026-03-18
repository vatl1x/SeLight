import { useState, useEffect } from "react";
import { api } from "../api";

export interface LogEntry {
    id: number;
    actor: string;
    action: string;
    details: string;
    timestamp: string;
}

export const useLogs = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const data = await api.getLogs();
            setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return { logs, loading, load };
};
