import DeviceCard from "../DeviceCard/DeviceCard";
import { Device } from "../../../interfaces";

import styles from "./Section.module.scss";

interface Props {
    title: string;
    devices: Device[];
    onToggle: (dev: Device) => void;
    toggling: string | null;
    canToggle: boolean;
}

const Section = ({ title, devices, onToggle, toggling, canToggle }: Props) => {
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
                        canToggle={canToggle}
                    />
                ))}
            </div>
        </div>
    );
};

export default Section;
