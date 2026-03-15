import { useState, useEffect } from 'react'
import { api } from '../api'
import './LightControl.css'

export default function LightControl() {
  const [actuators, setActuators] = useState(null)
  const [brightness, setBrightness] = useState(75)
  const [mode, setMode]             = useState('AUTO')
  const [armedLocal, setArmedLocal] = useState(false)
  const [msg, setMsg]               = useState('')
  const [msgType, setMsgType]       = useState('ok')

  async function load() {
    try {
      const a = await api.getActuatorsStatus()
      setActuators(a)
      setBrightness(a['light-ctrl']?.brightness ?? 75)
      setMode(a['light-ctrl']?.mode ?? 'AUTO')
      setArmedLocal(a['alarm-relay']?.armed ?? false)
    } catch(e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  function flash(text, type = 'ok') {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 3000)
  }

  async function applyLight() {
    try {
      await api.lightCommand(brightness, mode)
      flash(`✅ Яркость ${brightness}%, режим ${mode} применены`)
      load()
    } catch(e) { flash('❌ Ошибка: ' + e.message, 'err') }
  }

  async function applyAlarm(armed) {
    try {
      await api.alarmCommand(armed)
      setArmedLocal(armed)
      flash(armed ? '🔒 Сигнализация взведена' : '🔓 Сигнализация снята')
      load()
    } catch(e) { flash('❌ Ошибка: ' + e.message, 'err') }
  }

  const light = actuators?.['light-ctrl']
  const alarm = actuators?.['alarm-relay']

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Управление актуаторами</h1>
        <button className="btn btn-ghost" onClick={load}>↺ Обновить</button>
      </div>

      <div className="ctrl-grid">
        {/* ── Контроллер освещения ── */}
        <div className="card ctrl-card">
          <div className="card-title">💡 Контроллер освещения</div>

          <div className="current-state">
            <div className="cs-row">
              <span>Состояние</span>
              <span className={`badge ${light?.is_on ? 'badge-green' : 'badge-red'}`}>
                {light?.is_on ? '● Включён' : '● Выключен'}
              </span>
            </div>
            <div className="cs-row">
              <span>Яркость</span>
              <strong>{light?.brightness ?? '—'}%</strong>
            </div>
            <div className="cs-row">
              <span>Режим</span>
              <span className="badge badge-blue">{light?.mode ?? '—'}</span>
            </div>
          </div>

          <hr className="ctrl-sep" />

          <div className="ctrl-group">
            <label>Новая яркость: <strong>{brightness}%</strong></label>
            <input
              type="range" min="0" max="100" value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              className="range-slider"
            />
            <div className="quick-btns">
              <button className="btn btn-ghost" onClick={() => setBrightness(0)}>Выкл</button>
              <button className="btn btn-ghost" onClick={() => setBrightness(25)}>25%</button>
              <button className="btn btn-ghost" onClick={() => setBrightness(50)}>50%</button>
              <button className="btn btn-ghost" onClick={() => setBrightness(75)}>75%</button>
              <button className="btn btn-ghost" onClick={() => setBrightness(100)}>100%</button>
            </div>
          </div>

          <div className="ctrl-group">
            <label>Режим работы</label>
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'AUTO' ? 'active' : ''}`}
                onClick={() => setMode('AUTO')}
              >
                AUTO <small>Авто по датчику</small>
              </button>
              <button
                className={`mode-btn ${mode === 'MANUAL' ? 'active' : ''}`}
                onClick={() => setMode('MANUAL')}
              >
                MANUAL <small>Ручное управление</small>
              </button>
            </div>
          </div>

          <button className="btn btn-primary ctrl-apply" onClick={applyLight}>
            Применить команду
          </button>
        </div>

        {/* ── Реле сигнализации ── */}
        <div className="card ctrl-card">
          <div className="card-title">🚨 Реле сигнализации</div>

          <div className="current-state">
            <div className="cs-row">
              <span>Состояние</span>
              <span className={`badge ${alarm?.armed ? 'badge-yellow' : 'badge-green'}`}>
                {alarm?.armed ? '🔒 Взведена' : '🔓 Снята с охраны'}
              </span>
            </div>
            {alarm?.triggered && (
              <div className="cs-row">
                <span>Тревога</span>
                <span className="badge badge-red">⚠️ АКТИВНА</span>
              </div>
            )}
            <div className="cs-row">
              <span>Срабатываний</span>
              <strong>{alarm?.trigger_count ?? 0}</strong>
            </div>
          </div>

          <hr className="ctrl-sep" />

          <div className="alarm-desc">
            При взведённой сигнализации любое срабатывание датчика движения
            создаёт уведомление об охранном событии.
          </div>

          <div className="alarm-btns">
            <button
              className={`btn ${armedLocal ? 'btn-ghost' : 'btn-danger'}`}
              style={!armedLocal ? {background: 'var(--yellow)', color: '#0f1117'} : {}}
              onClick={() => applyAlarm(true)}
              disabled={armedLocal}
            >
              🔒 Взвести охрану
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => applyAlarm(false)}
              disabled={!armedLocal}
            >
              🔓 Снять с охраны
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`ctrl-msg ${msgType === 'err' ? 'ctrl-msg-err' : ''}`}>
          {msg}
        </div>
      )}
    </div>
  )
}
