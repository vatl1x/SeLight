import { Device } from "./DeviceCard/DeviceCard";

export const getSummaryItems = (devices: Device[]) => [
    { label: "Всего устройств", value: devices.length },
    {
        label: "Датчиков",
        value: devices.filter((d) => d.type === "sensor").length,
    },
    {
        label: "Актуаторов",
        value: devices.filter((d) => d.type === "actuator").length,
    },
    {
        label: "Активных",
        value: devices.filter((d) => d.is_active).length,
        green: true,
    },
];
