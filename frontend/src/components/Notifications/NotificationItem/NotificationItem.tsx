import { Notification } from "../../../hooks/useNotifications";
import { SEV_META, Severity } from "../Notifications.constants";
import styles from "./NotificationItem.module.scss";

interface Props {
    notification: Notification;
    onMarkRead: (id: number) => void;
}

export const NotificationItem = ({ notification, onMarkRead }: Props) => {
    const meta = SEV_META[notification.severity as Severity] ?? SEV_META.info;

    return (
        <div
            className={`
      ${styles.item}
      ${notification.read ? styles.read : ""}
      ${styles[meta.modifier]}
    `}
        >
            <span className={styles.icon}>{meta.icon}</span>
            <div className={styles.body}>
                <div className={styles.message}>{notification.message}</div>
                <div className={styles.meta}>
                    {notification.device_id && (
                        <span className={styles.device}>
                            {notification.device_id}
                        </span>
                    )}
                    <span>
                        {new Date(notification.timestamp).toLocaleString(
                            "ru-RU",
                        )}
                    </span>
                </div>
            </div>
            {!notification.read && (
                <button
                    className={styles.readBtn}
                    onClick={() => onMarkRead(notification.id)}
                >
                    Прочитано
                </button>
            )}
        </div>
    );
};
