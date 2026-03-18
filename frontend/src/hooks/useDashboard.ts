import { useState, useEffect } from "react";
import { api } from "../api";

export const useDashboard = () => {
    const [latest, setLatest] = useState<Record<string, any> | null>(null);
    const [analytics, setAnalytics] = useState<Record<string, any> | null>(
        null,
    );
    const [actuators, setActuators] = useState<Record<string, any> | null>(
        null,
    );
    const [hours, setHours] = useState(24);

    async function load() {
        try {
            const [latestReadings, analyticsData, actuatorsState] =
                await Promise.all([
                    api.getSensorsLatest(),
                    api.getSensorsAnalytics(hours),
                    api.getActuatorsStatus(),
                ]);
            setLatest(latestReadings);
            setAnalytics(analyticsData);
            setActuators(actuatorsState);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        load();
    }, [hours]);
    useEffect(() => {
        const t = setInterval(load, 6000);
        return () => clearInterval(t);
    }, [hours]);

    return { latest, analytics, actuators, hours, setHours, load };
};
