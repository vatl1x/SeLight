import { useState, useEffect } from 'react'
import { api } from '../api'
import './DeviceList.css'

const TYPE_META = {
  sensor:   { icon: '📡', label: 'Датчик' },
  actuator: { icon: '⚙️',  label: 'Актуатор' },
}

export default function DeviceList() {
  const [devices, setDevices] = useState([])
  const [toggling, setToggling] = useState(null)

  async function load() {
    try {
      const d = await api.getDevices()
      setDevices(d)
    } catch(e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  async function toggle(dev) {
    setToggling(dev.device_id)
    try {
      await api.patchDevice(dev.device_id, { is_active: !dev.is_active })
      load()
    } catch(e) { console.error(e) }
    finally { setToggling(null) }
  }

  const sensors   = devices.filter(d => d.type === 'sensor')
  const actuators = devices.filter(d => d.type === 'actuator')

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Список устройств</h1>
        <button className="btn btn-ghost" onClick={load}>↺ Обновить</button>
      </div>

      <div className="dev-summary">
        <div className="dev-sum-item">
          <span>Всего устройств</span>
          <strong>{devices.length}</strong>
        </div>
        <div className="dev-sum-item">
          <span>Датчиков</span>
          <strong>{sensors.length}</strong>
        </div>
        <div className="dev-sum-item">
          <span>Актуаторов</span>
          <strong>{actuators.length}</strong>
        </div>
        <div className="dev-sum-item">
          <span>Активных</span>
          <strong className="green">{devices.filter(d => d.is_active).length}</strong>
        </div>
      </div>

      <Section title="📡 Датчики" devices={sensors} onToggle={toggle} toggling={toggling} />
      <Section title="⚙️ Актуаторы" devices={actuators} onToggle={toggle} toggling={toggling} />
    </div>
  )
}

function Section({ title, devices, onToggle, toggling }) {
  return (
    <div className="dev-section">
      <h2 className="dev-section-title">{title}</h2>
      <div className="dev-grid">
        {devices.map(dev => (
          <DevCard key={dev.id} dev={dev} onToggle={onToggle} toggling={toggling} />
        ))}
      </div>
    </div>
  )
}

function DevCard({ dev, onToggle, toggling }) {
  const busy = toggling === dev.device_id
  return (
    <div className={`dev-card card ${dev.is_active ? '' : 'dev-inactive'}`}>
      <div className="dev-card-top">
        <div className="dev-type-icon">
          {dev.type === 'sensor' ? '📡' : '⚙️'}
        </div>
        <div className={`dev-status-dot ${dev.is_active ? 'online' : 'offline'}`} />
      </div>
      <div className="dev-id">{dev.device_id}</div>
      <div className="dev-name">{dev.name}</div>
      <div className="dev-desc">{dev.description}</div>
      {dev.unit && (
        <div className="dev-range">
          Диапазон: {dev.value_min} – {dev.value_max} {dev.unit}
        </div>
      )}
      <div className="dev-footer">
        <span className={`badge ${dev.is_active ? 'badge-green' : 'badge-red'}`}>
          {dev.is_active ? 'Активен' : 'Отключён'}
        </span>
        <button
          className={`btn ${dev.is_active ? 'btn-ghost' : 'btn-success'}`}
          style={{padding:'5px 12px', fontSize:12}}
          onClick={() => onToggle(dev)}
          disabled={busy}
        >
          {busy ? '…' : dev.is_active ? 'Отключить' : 'Включить'}
        </button>
      </div>
    </div>
  )
}
