import { NAV_ITEMS } from "./Sidebar.constants";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { NavItem } from "../NavItem/NavItem";
import styles from "./Sidebar.module.scss";

interface Props {
    current: string;
    onNavigate: (id: string) => void;
    onLogout: () => void;
}

const Sidebar = ({ current, onNavigate, onLogout }: Props) => {
    const { unreadCount } = useUnreadCount();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.logo}>💡</span>
                <div>
                    <div className={styles.name}>S.E. Light</div>
                    <div className={styles.version}>IoT v2.0</div>
                </div>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.id}
                        id={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={current === item.id}
                        unreadCount={
                            item.id === "notifications"
                                ? unreadCount
                                : undefined
                        }
                        onClick={onNavigate}
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
