import { useState, useEffect } from 'react'
import { api } from '../api'
import './Dashboard.css'

// Простой inline-bar-chart без зависимостей
function MiniChart({ series, color, unit }) {
  if (!series || series.length === 0) return <div className="chart-empty">Нет данных</div>
  const vals = series.map(p => p.value)
  const mx   = Math.max(...vals) || 1
  // берём не более 40 последних точек
  const pts  = series.slice(-40)
  return (
    <div className="mini-chart">
      {pts.map((p, i) => (
        <div key={i} className="mc-bar-wrap" title={`${p.time}: ${p.value} ${unit}`}>
          <div
            className="mc-bar"
            style={{ height: `${(p.value / mx) * 100}%`, background: color }}
          />
        </div>
      ))}
    </div>
  )
}

function StatCard({ icon, label, value, unit, color, sub }) {
  return (
    <div className="stat-card">
      <div className="sc-top">
        <span className="sc-icon">{icon}</span>
        <span className="sc-label">{label}</span>
      </div>
      <div className="sc-value" style={{ color }}>{value}<span className="sc-unit">{unit}</span></div>
      {sub && <div className="sc-sub">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [latest,   setLatest]   = useState(null)
  const [analytics,setAnalytics]= useState(null)
  const [actuators,setActuators]= useState(null)
  const [hours,    setHours]    = useState(24)

  async function load() {
    try {
      const [l, a, act] = await Promise.all([
        api.getSensorsLatest(),
        api.getSensorsAnalytics(hours),
        api.getActuatorsStatus(),
      ])
      setLatest(l)
      setAnalytics(a)
      setActuators(act)
    } catch(e) { console.error(e) }
  }

  useEffect(() => { load() }, [hours])
  useEffect(() => {
    const t = setInterval(load, 6000)
    return () => clearInterval(t)
  }, [hours])

  const lux   = latest?.['lux-sensor']
  const mot   = latest?.['motion-sensor']
  const temp  = latest?.['temp-sensor']
  const power = latest?.['power-sensor']
  const light = actuators?.['light-ctrl']
  const alarm = actuators?.['alarm-relay']

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Дашборд</h1>
        <div className="dash-controls">
          <select
            className="period-select"
            value={hours}
            onChange={e => setHours(Number(e.target.value))}
          >
            <option value={1}>Последний час</option>
            <option value={6}>6 часов</option>
            <option value={24}>24 часа</option>
            <option value={72}>3 дня</option>
          </select>
          <button className="btn btn-ghost" onClick={load}>↺ Обновить</button>
        </div>
      </div>

      {/* Актуаторы — краткий статус */}
      <div className="grid-2" style={{marginBottom: 20}}>
        <div className="card actuator-card">
          <div className="card-title">💡 Контроллер освещения</div>
          <div className="act-row">
            <span className={`badge ${light?.is_on ? 'badge-green' : 'badge-red'}`}>
              {light?.is_on ? '● Включён' : '● Выключен'}
            </span>
            <span className="badge badge-blue">{light?.mode ?? '—'}</span>
          </div>
          <div className="act-brightness">
            <span>Яркость</span>
            <div className="brightness-track">
              <div className="brightness-fill" style={{width: `${light?.brightness ?? 0}%`}} />
            </div>
            <strong>{light?.brightness ?? 0}%</strong>
          </div>
        </div>

        <div className="card actuator-card">
          <div className="card-title">🚨 Реле сигнализации</div>
          <div className="act-row">
            <span className={`badge ${alarm?.armed ? 'badge-yellow' : 'badge-green'}`}>
              {alarm?.armed ? '🔒 Взведена' : '🔓 Снята'}
            </span>
            {alarm?.triggered && <span className="badge badge-red">⚠️ Тревога!</span>}
          </div>
          {alarm?.armed && (
            <div className="act-sub">Срабатываний: {alarm.trigger_count}</div>
          )}
        </div>
      </div>

      {/* Датчики — последние значения */}
      <div className="grid-4" style={{marginBottom: 20}}>
        <StatCard
          icon="☀️" label="Освещённость"
          value={lux?.value?.toFixed(0) ?? '—'} unit=" Lux"
          color="var(--yellow)"
          sub={lux?.timestamp ? new Date(lux.timestamp).toLocaleTimeString('ru-RU') : ''}
        />
        <StatCard
          icon="🏃" label="Движение"
          value={mot?.value === 1 ? 'Да' : 'Нет'} unit=""
          color={mot?.value === 1 ? 'var(--red)' : 'var(--green)'}
        />
        <StatCard
          icon="🌡️" label="Температура"
          value={temp?.value?.toFixed(1) ?? '—'} unit=" °C"
          color="var(--accent)"
        />
        <StatCard
          icon="⚡" label="Мощность"
          value={power?.value?.toFixed(1) ?? '—'} unit=" Вт"
          color="var(--accent2)"
          sub={`${analytics?.energy_summary?.total_kwh ?? 0} кВт⋅ч за период`}
        />
      </div>

      {/* Графики */}
      {analytics && (
        <div className="charts-grid">
          <div className="card">
            <div className="card-title">☀️ Освещённость (Lux)</div>
            <div className="chart-stats">
              <span>Ср: {analytics.sensors['lux-sensor']?.avg}</span>
              <span>Мин: {analytics.sensors['lux-sensor']?.min}</span>
              <span>Макс: {analytics.sensors['lux-sensor']?.max}</span>
            </div>
            <MiniChart series={analytics.sensors['lux-sensor']?.series} color="#fbbf24" unit="Lux" />
          </div>

          <div className="card">
            <div className="card-title">⚡ Мощность (Вт)</div>
            <div className="chart-stats">
              <span>Ср: {analytics.sensors['power-sensor']?.avg} Вт</span>
              <span>Всего: {analytics.energy_summary?.total_kwh} кВт⋅ч</span>
            </div>
            <MiniChart series={analytics.sensors['power-sensor']?.series} color="#a78bfa" unit="Вт" />
          </div>

          <div className="card">
            <div className="card-title">🌡️ Температура (°C)</div>
            <div className="chart-stats">
              <span>Ср: {analytics.sensors['temp-sensor']?.avg}°C</span>
              <span>Мин: {analytics.sensors['temp-sensor']?.min}°C</span>
              <span>Макс: {analytics.sensors['temp-sensor']?.max}°C</span>
            </div>
            <MiniChart series={analytics.sensors['temp-sensor']?.series} color="#6c8aff" unit="°C" />
          </div>

          <div className="card">
            <div className="card-title">🏃 Движение (события)</div>
            <div className="chart-stats">
              <span>Событий: {analytics.sensors['motion-sensor']?.count}</span>
              <span>Детекций: {Math.round((analytics.sensors['motion-sensor']?.avg ?? 0) * 100)}%</span>
            </div>
            <MiniChart series={analytics.sensors['motion-sensor']?.series} color="#34d399" unit="" />
          </div>
        </div>
      )}
    </div>
  )
}
