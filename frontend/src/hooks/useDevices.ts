import { useEffect, useState } from "react";
import { api } from "../api";
import { Device } from "../components/DeviceCard/DeviceCard";

export const useDevices = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [toggling, setToggling] = useState(null);

    const load = async() => {
        try {
            const d = await api.getDevices();
            setDevices(d);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const toggle = async (dev) => {
        setToggling(dev.device_id);
        try {
            await api.patchDevice(dev.device_id, { is_active: !dev.is_active });
            load();
        } catch (e) {
            console.error(e);
        } finally {
            setToggling(null);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return { devices, toggling, load, toggle };
};
