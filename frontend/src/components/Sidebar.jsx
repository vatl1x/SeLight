import { useEffect, useState } from 'react'
import { api } from '../api'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard',     icon: '📊', label: 'Дашборд' },
  { id: 'control',       icon: '💡', label: 'Управление' },
  { id: 'devices',       icon: '🔌', label: 'Устройства' },
  { id: 'notifications', icon: '🔔', label: 'Уведомления' },
  { id: 'logs',          icon: '📋', label: 'Журнал' },
]

export default function Sidebar({ current, onNavigate, onLogout }) {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const load = () => api.getUnreadCount().then(d => setUnread(d.count)).catch(() => {})
    load()
    const t = setInterval(load, 10000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">💡</span>
        <div>
          <div className="sidebar-name">S.E. Light</div>
          <div className="sidebar-version">IoT v2.0</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${current === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'notifications' && unread > 0 && (
              <span className="nav-badge">{unread}</span>
            )}
          </button>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        <span>🚪</span> Выйти
      </button>
    </aside>
  )
}
