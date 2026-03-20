import { NAV_ITEMS } from "./Sidebar.constants";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { NavItem } from "./NavItem/NavItem";
import styles from "./Sidebar.module.scss";

interface Props {
    onLogout: () => void;
    role: string | null;
}

const Sidebar = ({ onLogout, role }: Props) => {
    const { unreadCount } = useUnreadCount();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.logo}>💡</span>
                <div>
                    <div className={styles.name}>S.E. Light</div>
                </div>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.filter(
                    (item) => !item.adminOnly || role === "admin",
                ).map((item) => (
                    <NavItem
                        key={item.id}
                        id={item.id}
                        icon={item.icon}
                        label={item.label}
                        unreadCount={
                            item.id === "notifications"
                                ? unreadCount
                                : undefined
                        }
                    />
                ))}
            </nav>

            <button className={styles.logoutBtn} onClick={onLogout}>
                <span>🚪</span> Выйти
            </button>
        </aside>
    );
};

export default Sidebar;
