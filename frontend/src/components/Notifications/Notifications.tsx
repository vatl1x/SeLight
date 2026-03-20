import { AuthUser } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { useRefresh } from "../../hooks/useRefresh";
import { NotificationFilters } from "./NotificationFilters/NotificationFilters";
import { NotificationItem } from "./NotificationItem/NotificationItem";
import styles from "./Notifications.module.scss";

const Notifications = () => {
    const { refreshing, refresh } = useRefresh();

    const {
        notifications,
        filter,
        setFilter,
        loading,
        markRead,
        readAll,
        unreadCount,
        clearAll,
        load,
    } = useNotifications();

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
                    <button
                        className="btn btn-danger"
                        onClick={clearAll}
                        disabled={notifications.length === 0}
                    >
                        🗑 Очистить
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => refresh(load)}
                    >
                        ↺
                    </button>
                </div>
            </div>

            <NotificationFilters current={filter} onChange={setFilter} />

            <div className={refreshing ? "refreshing" : ""}>
                {loading && <div className={styles.empty}>Загрузка…</div>}
                {!loading && notifications.length === 0 && (
                    <div className={styles.empty}>Нет уведомлений</div>
                )}
                <div className={styles.list}>
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkRead={markRead}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
