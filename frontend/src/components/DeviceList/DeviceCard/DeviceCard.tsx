import { Device } from "../../../interfaces";
import styles from "./DeviceCard.module.scss";

export interface Props {
    dev: Device;
    onToggle: (dev: Device) => void;
    toggling: string | null;
    canToggle: boolean;
}

const DeviceCard = ({ dev, onToggle, toggling, canToggle }: Props) => {
    const busy = toggling === dev.device_id;

    return (
        <div
            className={`${styles.devCard} ${styles.card} ${!dev.is_active ? styles.devInactive : ""}`}
        >
            <div className={styles.devCardTop}>
                <div className={styles.devTypeIcon}>
                    {dev.type === "sensor" ? "📡" : "⚙️"}
                </div>
                <div
                    className={`${styles.devStatusDot} ${dev.is_active ? styles.online : styles.offline}`}
                />
            </div>

            <div className={styles.devId}>{dev.device_id}</div>
            <div className={styles.devName}>{dev.name}</div>
            <div className={styles.devDesc}>{dev.description}</div>

            {dev.unit && (
                <div className={styles.devRange}>
                    Диапазон: {dev.value_min} – {dev.value_max} {dev.unit}
                </div>
            )}

            <div className={styles.devFooter}>
                <span
                    className={`badge ${dev.is_active ? "badge-green" : "badge-red"}`}
                >
                    {dev.is_active ? "Активен" : "Отключён"}
                </span>
                {canToggle && (
                    <button
                        className={`btn ${dev.is_active ? "btn-ghost" : "btn-success"}`}
                        style={{ padding: "5px 12px", fontSize: 12 }}
                        onClick={() => onToggle(dev)}
                        disabled={busy}
                    >
                        {busy ? "…" : dev.is_active ? "Отключить" : "Включить"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DeviceCard;
