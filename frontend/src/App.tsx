import { useState, useEffect } from 'react'
import Login from './components/Login/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'
import LightControl from './components/LightControl'
import Notifications from './components/Notifications'
import DeviceList from './components/DeviceList/DeviceList'
import Logs from './components/Logs/Logs'
import './App.css'

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [page, setPage] = useState('dashboard')

  function handleLogin(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  const pages = {
    dashboard:    <Dashboard />,
    control:      <LightControl />,
    notifications:<Notifications />,
    devices:      <DeviceList />,
    logs:         <Logs />,
  }

  return (
    <div className="app-layout">
      <Sidebar
        current={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      <main className="app-main">
        {pages[page] ?? <Dashboard />}
      </main>
    </div>
  )
}
