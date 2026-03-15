import { useState, useEffect } from 'react'
import { api } from '../api'
import './Logs.css'

const ACTION_ICON = {
  login:                   '🔑',
  startup:                 '🚀',
  emulator:                '🤖',
  light_command:           '💡',
  alarm_command:           '🚨',
  device_patch:            '🔌',
  read_all_notifications:  '🔔',
}

export default function Logs() {
  const [logs, setLogs]     = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const data = await api.getLogs()
      setLogs(data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Журнал действий</h1>
        <button className="btn btn-ghost" onClick={load}>↺ Обновить</button>
      </div>

      {loading && <div className="log-empty">Загрузка…</div>}

      {!loading && logs.length === 0 && (
        <div className="log-empty">Журнал пуст</div>
      )}

      <div className="card log-table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Время</th>
              <th>Актор</th>
              <th>Действие</th>
              <th>Детали</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(row => (
              <tr key={row.id}>
                <td className="log-id">{row.id}</td>
                <td className="log-time">
                  {new Date(row.timestamp).toLocaleString('ru-RU')}
                </td>
                <td>
                  <span className={`badge ${row.actor === 'system' ? 'badge-blue' : 'badge-green'}`}>
                    {row.actor}
                  </span>
                </td>
                <td>
                  <span className="log-action">
                    {ACTION_ICON[row.action] ?? '📌'} {row.action}
                  </span>
                </td>
                <td className="log-details">{row.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
