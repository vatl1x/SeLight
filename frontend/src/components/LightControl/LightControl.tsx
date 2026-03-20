import { useLightControl } from "../../hooks/useLightControl";
import { LightController } from "./LightController/LightController";
import { AlarmRelay } from "./AlarmRelay/AlarmRelay";
import { useRefresh } from "../../hooks/useRefresh";
import { AuthUser } from "../../hooks/useAuth";
import styles from "./LightControl.module.scss";

interface Props {
    user: AuthUser | null;
}

const LightControl = ({ user }: Props) => {
    const { refreshing, refresh } = useRefresh();

    const {
        light,
        alarm,
        brightness,
        setBrightness,
        mode,
        setMode,
        armedLocal,
        msg,
        msgType,
        load,
        applyLight,
        applyAlarm,
    } = useLightControl();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Управление актуаторами</h1>
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        refresh(load);
                    }}
                >
                    ↺ Обновить
                </button>
            </div>

            <div className={refreshing ? "refreshing" : ""}>
                <div className={styles.grid}>
                    <LightController
                        light={light}
                        brightness={brightness}
                        mode={mode}
                        onBrightnessChange={setBrightness}
                        onModeChange={setMode}
                        onApply={applyLight}
                    />
                    {user?.role === "admin" && (
                        <AlarmRelay
                            alarm={alarm}
                            armedLocal={armedLocal}
                            onApply={applyAlarm}
                        />
                    )}
                </div>

                {msg && (
                    <div
                        className={`${styles.msg} ${msgType === "err" ? styles.msgErr : ""}`}
                    >
                        {msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LightControl;
