import styles from "./MiniChart.module.scss"

interface DataPoint {
  time: string
  value: number
}

interface Props {
  series: DataPoint[]
  color: string
  unit: string
}

export const MiniChart = ({ series, color, unit }: Props) => {
  if (!series || series.length === 0) {
    return <div className={styles.empty}>Нет данных</div>
  }

  const values      = series.map((point) => point.value)
  const maxValue    = Math.max(...values) || 1
  const visiblePts  = series.slice(-40)

  return (
    <div className={styles.chart}>
      {visiblePts.map((point, index) => (
        <div
          key={index}
          className={styles.barWrap}
          title={`${point.time}: ${point.value} ${unit}`}
        >
          <div
            className={styles.bar}
            style={{ height: `${(point.value / maxValue) * 100}%`, background: color }}
          />
        </div>
      ))}
    </div>
  )
}