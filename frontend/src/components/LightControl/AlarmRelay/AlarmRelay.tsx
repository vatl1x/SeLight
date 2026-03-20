import { AlarmState } from "../../../interfaces";
import styles from "./AlarmRelay.module.scss";

interface Props {
    alarm: AlarmState | null;
    armedLocal: boolean;
    onApply: (armed: boolean) => void;
}

export const AlarmRelay = ({ alarm, armedLocal, onApply }: Props) => (
    <div className="card">
        <div className="card-title">🚨 Реле сигнализации</div>

        <div className={styles.currentState}>
            <div className={styles.row}>
                <span>Состояние</span>
                <span
                    className={`badge ${alarm?.armed ? "badge-yellow" : "badge-green"}`}
                >
                    {alarm?.armed ? "🔒 Взведена" : "🔓 Снята с охраны"}
                </span>
            </div>
            {alarm?.triggered && (
                <div className={styles.row}>
                    <span>Тревога</span>
                    <span className="badge badge-red">⚠️ АКТИВНА</span>
                </div>
            )}
            <div className={styles.row}>
                <span>Срабатываний</span>
                <strong>{alarm?.trigger_count ?? 0}</strong>
            </div>
        </div>

        <hr className={styles.sep} />

        <div className={styles.desc}>
            При взведённой сигнализации любое срабатывание датчика движения
            создаёт уведомление об охранном событии.
        </div>

        <div className={styles.btns}>
            <button
                className="btn"
                style={
                    !armedLocal
                        ? { background: "var(--yellow)", color: "#0f1117" }
                        : {}
                }
                onClick={() => onApply(true)}
                disabled={armedLocal}
            >
                🔒 Взвести охрану
            </button>
            <button
                className="btn btn-ghost"
                onClick={() => onApply(false)}
                disabled={!armedLocal}
            >
                🔓 Снять с охраны
            </button>
        </div>
    </div>
);
