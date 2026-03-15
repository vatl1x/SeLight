const BASE = 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.reload()
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  login: (username, password) => {
    const body = new URLSearchParams({ username, password })
    return request('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
  },
  me: () => request('/auth/me'),

  getDevices: () => request('/devices'),
  patchDevice: (id, data) =>
    request(`/devices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),

  getSensorsLatest: () => request('/sensors/latest'),
  getSensorsAnalytics: (hours = 24) => request(`/sensors/analytics?hours=${hours}`),

  getActuatorsStatus: () => request('/actuators/status'),
  lightCommand: (brightness, mode) =>
    request('/actuators/light-ctrl/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brightness, mode }),
    }),
  alarmCommand: (armed) =>
    request('/actuators/alarm-relay/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armed }),
    }),

  getNotifications: (unreadOnly = false) =>
    request(`/notifications${unreadOnly ? '?unread_only=true' : ''}`),
  getUnreadCount: () => request('/notifications/unread-count'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  readAll: () => request('/notifications/read-all', { method: 'POST' }),

  getLogs: () => request('/logs'),
}
