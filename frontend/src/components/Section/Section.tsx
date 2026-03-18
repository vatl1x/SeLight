import DeviceCard, { Device } from "../DeviceCard/DeviceCard";
import styles from "./Section.module.scss";

interface Props {
    title: string;
    devices: Device[];
    onToggle: (dev: Device) => void;
    toggling: string | null;
}

const Section = ({ title, devices, onToggle, toggling }: Props) => {
    return (
        <div className={styles.dev_section}>
            <h2 className={styles.dev_section_title}>{title}</h2>
            <div className={styles.dev_grid}>
                {devices.map((dev) => (
                    <DeviceCard
                        key={dev.id}
                        dev={dev}
                        onToggle={onToggle}
                        toggling={toggling}
                    />
                ))}
            </div>
        </div>
    );
};

export default Section;
