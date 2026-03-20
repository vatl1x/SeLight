import styles from "./StatCard.module.scss";

interface Props {
    icon: string;
    label: string;
    value: string;
    unit: string;
    color: string;
    sub?: string;
}

export const StatCard = ({ icon, label, value, unit, color, sub }: Props) => (
    <div className={styles.stat_card}>
        <div className={styles.sc_top}>
            <span className={styles.sc_icon}>{icon}</span>
            <span className={styles.sc_label}>{label}</span>
        </div>
        <div className={styles.sc_value} style={{ color }}>
            {value}
            <span className={styles.sc_unit}>{unit}</span>
        </div>
        {sub && <div className={styles.sc_sub}>{sub}</div>}
    </div>
);
