import { NavLink } from "react-router-dom";
import styles from "./NavItem.module.scss";
interface Props {
    id: string;
    icon: string;
    label: string;
    unreadCount?: number;
}

export const NavItem = ({ id, icon, label, unreadCount }: Props) => (
    <NavLink
        to={`/${id}`}
        className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
        }
    >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
        {unreadCount && unreadCount > 0 ? (
            <span className={styles.badge}>{unreadCount}</span>
        ) : null}
    </NavLink>
);
