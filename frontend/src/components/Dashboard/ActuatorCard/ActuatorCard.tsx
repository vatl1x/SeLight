import { AlarmState, LightState } from "../../../interfaces"
import styles from "./ActuatorCard.module.scss"

interface Props {
  type: "light" | "alarm"
  state: LightState | AlarmState | null
}

export const ActuatorCard = ({ type, state }: Props) => {
  if (type === "light") {
    const light = state as LightState | null
    return (
      <div className="card">
        <div className="card-title">💡 Контроллер освещения</div>
        <div className={styles.act_row}>
          <span className={`badge ${light?.is_on ? "badge-green" : "badge-red"}`}>
            {light?.is_on ? "● Включён" : "● Выключен"}
          </span>
          <span className="badge badge-blue">{light?.mode ?? "—"}</span>
        </div>
        <div className={styles.act_brightness}>
          <span>Яркость</span>
          <div className={styles.brightness_track}>
            <div
              className={styles.brightness_fill}
              style={{ width: `${light?.brightness ?? 0}%` }}
            />
          </div>
          <strong>{light?.brightness ?? 0}%</strong>
        </div>
      </div>
    )
  }

  const alarm = state as AlarmState | null
  return (
    <div className="card">
      <div className="card-title">🚨 Реле сигнализации</div>
      <div className={styles.act_row}>
        <span className={`badge ${alarm?.armed ? "badge-yellow" : "badge-green"}`}>
          {alarm?.armed ? "🔒 Взведена" : "🔓 Снята"}
        </span>
        {alarm?.triggered && (
          <span className="badge badge-red">⚠️ Тревога!</span>
        )}
      </div>
      {alarm?.armed && (
        <div className={styles.act_sub}>
          Срабатываний: {alarm.trigger_count}
        </div>
      )}
    </div>
  )
}