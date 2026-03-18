import styles from './'
interface Props {
    id: string;
    icon: string;
    label: string;
    isActive: boolean;
    unreadCount?: number;
    onClick: (id: string) => void;
}

export const NavItem = ({
    id,
    icon,
    label,
    isActive,
    unreadCount,
    onClick,
}: Props) => (
    <button
        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
        onClick={() => onClick(id)}
    >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
        {unreadCount && unreadCount > 0 ? (
            <span className={styles.badge}>{unreadCount}</span>
        ) : null}
    </button>
);
