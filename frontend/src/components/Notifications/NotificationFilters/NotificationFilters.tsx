import { FILTERS, FilterType } from "../Notifications.constants";
import styles from "./NotificationFilters.module.scss";

interface Props {
    current: FilterType;
    onChange: (filter: FilterType) => void;
}

export const NotificationFilters = ({ current, onChange }: Props) => (
    <div className={styles.filters}>
        {FILTERS.map((filter) => (
            <button
                key={filter.id}
                className={`${styles.btn} ${current === filter.id ? styles.active : ""}`}
                onClick={() => onChange(filter.id)}
            >
                {filter.label}
            </button>
        ))}
    </div>
);
