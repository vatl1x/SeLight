import { useState, useEffect } from "react";
import { LogEntry } from "../interfaces";
import { api } from "../api";


export const useLogs = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const data = await api.getLogs() as LogEntry[];
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
