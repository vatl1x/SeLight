import Section from "./Section/Section";
import { useDevices } from "../../hooks/useDevices";
import { useRefresh } from "../../hooks/useRefresh";
import { getSummaryItems } from "./DeviceList.constants";
import { AuthUser } from "../../interfaces";
import styles from "./DeviceList.module.scss";

interface Props {
    user: AuthUser | null;
}

const DeviceList = ({ user }: Props) => {
    const { refreshing, refresh } = useRefresh();
    const { devices, toggling, load, toggle } = useDevices();

    const sensors = devices.filter((d) => d.type === "sensor");
    const actuators = devices.filter((d) => d.type === "actuator");
    const summaryItems = getSummaryItems(devices);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Список устройств</h1>
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        refresh(load);
                    }}
                >
                    ↺ Обновить
                </button>
            </div>

            <div className={refreshing ? "refreshing" : ""}>
                <div className={styles.dev_summary}>
                    {summaryItems.map((item) => (
                        <div key={item.label} className={styles.dev_sum_item}>
                            <span>{item.label}</span>
                            <strong className={item.green ? "green" : ""}>
                                {item.value}
                            </strong>
                        </div>
                    ))}
                </div>

                <Section
                    title="📡 Датчики"
                    devices={sensors}
                    onToggle={toggle}
                    toggling={toggling}
                    canToggle={user?.role === "admin"}
                />
                <Section
                    title="⚙️ Актуаторы"
                    devices={actuators}
                    onToggle={toggle}
                    toggling={toggling}
                    canToggle={user?.role === "admin"}
                />
            </div>
        </div>
    );
};

export default DeviceList;
