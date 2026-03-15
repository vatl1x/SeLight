"""
Эмулятор датчиков IoT-системы.
Запускается в фоновом потоке и каждые INTERVAL секунд генерирует
псевдослучайные данные для 4 датчиков, сохраняет их в БД и при
необходимости создаёт уведомления.
"""

import time
import random
import json
import threading
from datetime import datetime

# Интервал опроса датчиков (секунды)
INTERVAL = 5

# ── Внутреннее состояние симуляции ─────────────────────────────────────────
_state = {
    "lux": 300.0,          # Датчик освещённости, Lux
    "motion": 0.0,         # Датчик движения, 0/1
    "temperature": 22.0,   # Датчик температуры, °C
    "power": 15.0,         # Датчик потребляемой мощности, Вт
}

# Текущие состояния актуаторов (in-memory, реальные команды сюда же)
actuator_states: dict = {
    "light-ctrl": {
        "brightness": 75,
        "mode": "AUTO",
        "is_on": True,
    },
    "alarm-relay": {
        "armed": False,
        "triggered": False,
        "trigger_count": 0,
    },
}

_stop_event = threading.Event()


def _next_lux(current: float) -> float:
    """Случайное блуждание с границами 0…1000."""
    delta = random.gauss(0, 30)
    return max(0.0, min(1000.0, current + delta))


def _next_temperature(current: float) -> float:
    """Температура дрейфует в диапазоне 18…30 °C."""
    delta = random.gauss(0, 0.3)
    return round(max(18.0, min(30.0, current + delta)), 1)


def _next_motion() -> float:
    """Движение детектируется с вероятностью 15 %."""
    return 1.0 if random.random() < 0.15 else 0.0


def _next_power(lux: float) -> float:
    """
    Мощность зависит от яркости актуатора.
    В режиме AUTO яркость обратно пропорциональна освещённости.
    """
    light = actuator_states["light-ctrl"]
    if light["mode"] == "AUTO":
        # чем темнее снаружи — тем ярче горит свет
        auto_brightness = max(0, 100 - int(lux / 10))
        light["brightness"] = auto_brightness
        light["is_on"] = auto_brightness > 0
    w = light["brightness"] / 100 * 45 + random.gauss(0, 1)
    return round(max(0.0, w), 1)


def _check_notifications(db_session, lux, motion, temp, power):
    """Создаёт уведомления при выходе показаний за пороги."""
    from ..models import Notification

    alerts = []
    if lux < 80 and motion == 1.0:
        alerts.append(Notification(
            message="Обнаружено движение при низкой освещённости",
            severity="warning", device_id="motion-sensor"
        ))
    if temp > 27.0:
        alerts.append(Notification(
            message=f"Высокая температура: {temp} °C",
            severity="warning", device_id="temp-sensor"
        ))
    if power > 40.0:
        alerts.append(Notification(
            message=f"Высокое энергопотребление: {power} Вт",
            severity="error", device_id="power-sensor"
        ))
    # Тревога по датчику движения, если сигнализация взведена
    alarm = actuator_states["alarm-relay"]
    if alarm["armed"] and motion == 1.0:
        alarm["triggered"] = True
        alarm["trigger_count"] += 1
        alerts.append(Notification(
            message="⚠️ Тревога! Движение при взведённой сигнализации",
            severity="error", device_id="motion-sensor"
        ))

    for a in alerts:
        db_session.add(a)


def _log(db_session, details: str):
    from .models import ActionLog
    db_session.add(ActionLog(actor="system", action="emulator", details=details))


def emulator_loop():
    """Основной цикл эмулятора. Запускается в отдельном потоке."""
    # Импорт здесь, чтобы избежать кругового импорта
    from ..database import SessionLocal
    from ..models import SensorReading

    while not _stop_event.is_set():
        try:
            # Генерируем новые значения
            _state["lux"] = round(_next_lux(_state["lux"]), 1)
            _state["motion"] = _next_motion()
            _state["temperature"] = _next_temperature(_state["temperature"])
            _state["power"] = _next_power(_state["lux"])

            db = SessionLocal()
            try:
                ts = datetime.now()
                readings = [
                    SensorReading(device_id="lux-sensor",    value=_state["lux"],         timestamp=ts),
                    SensorReading(device_id="motion-sensor", value=_state["motion"],       timestamp=ts),
                    SensorReading(device_id="temp-sensor",   value=_state["temperature"],  timestamp=ts),
                    SensorReading(device_id="power-sensor",  value=_state["power"],        timestamp=ts),
                ]
                db.add_all(readings)
                _check_notifications(db, _state["lux"], _state["motion"],
                                     _state["temperature"], _state["power"])
                db.commit()
            finally:
                db.close()

        except Exception as exc:
            print(f"[emulator] error: {exc}")

        _stop_event.wait(INTERVAL)


def start():
    t = threading.Thread(target=emulator_loop, daemon=True, name="sensor-emulator")
    t.start()
    return t


def stop():
    _stop_event.set()