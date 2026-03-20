import { LightState } from "../../../interfaces";
import {
    QUICK_BRIGHTNESS,
    MODES,
    ModeType,
} from "../LightControl.constants";
import styles from "./LightController.module.scss";

interface Props {
    light: LightState | null;
    brightness: number;
    mode: string;
    onBrightnessChange: (value: number) => void;
    onModeChange: (mode: ModeType) => void;
    onApply: () => void;
}

export const LightController = ({
    light,
    brightness,
    mode,
    onBrightnessChange,
    onModeChange,
    onApply,
}: Props) => (
    <div className="card">
        <div className="card-title">💡 Контроллер освещения</div>

        <div className={styles.currentState}>
            <div className={styles.row}>
                <span>Состояние</span>
                <span
                    className={`badge ${light?.is_on ? "badge-green" : "badge-red"}`}
                >
                    {light?.is_on ? "● Включён" : "● Выключен"}
                </span>
            </div>
            <div className={styles.row}>
                <span>Яркость</span>
                <strong>{light?.brightness ?? "—"}%</strong>
            </div>
            <div className={styles.row}>
                <span>Режим</span>
                <span className="badge badge-blue">{light?.mode ?? "—"}</span>
            </div>
        </div>

        <hr className={styles.sep} />

        <div className={styles.group}>
            <label>
                Новая яркость: <strong>{brightness}%</strong>
            </label>
            <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className={styles.slider}
            />
            <div className={styles.quickBtns}>
                {QUICK_BRIGHTNESS.map((btn) => (
                    <button
                        key={btn.value}
                        className="btn btn-ghost"
                        onClick={() => onBrightnessChange(btn.value)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>

        <div className={styles.group}>
            <label>Режим работы</label>
            <div className={styles.modeToggle}>
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        className={`${styles.modeBtn} ${mode === m.id ? styles.active : ""}`}
                        onClick={() => onModeChange(m.id as ModeType)}
                    >
                        {m.label} <small>{m.sub}</small>
                    </button>
                ))}
            </div>
        </div>

        <button
            className={`btn btn-primary ${styles.applyBtn}`}
            onClick={onApply}
        >
            Применить команду
        </button>
    </div>
);
