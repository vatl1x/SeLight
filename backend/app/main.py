"""
S.E. Light — главный модуль приложения.
Только инициализация БД, seed-данные и подключение роутеров.
"""
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, SessionLocal
from .models import Base, User, Device, Notification, ActionLog
from .services import emulator
from .routers import auth, devices, sensors, actuators, notifications, logs

# ── Создание таблиц ──────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)


# ── Начальные данные ─────────────────────────────────────────────────────────
def seed(db: Session):
    if db.query(User).first():
        return

    db.add_all([
    User(username="admin",    email="admin@selight.com", password="admin123", role="admin"),
    User(username="operator", email="op@selight.com",    password="op123",    role="operator"),
])
    db.add_all([
        Device(device_id="lux-sensor",    name="Датчик освещённости",   type="sensor",
               description="Уровень внешней освещённости",
               unit="Lux",  value_min=0,  value_max=1000),
        Device(device_id="motion-sensor", name="Датчик движения (PIR)",  type="sensor",
               description="Обнаружение движения (0/1)",
               unit="bool", value_min=0,  value_max=1),
        Device(device_id="temp-sensor",   name="Датчик температуры",    type="sensor",
               description="Температура окружающей среды",
               unit="°C",   value_min=18, value_max=30),
        Device(device_id="power-sensor",  name="Датчик мощности",       type="sensor",
               description="Потребляемая мощность системы",
               unit="Вт",   value_min=0,  value_max=50),
        Device(device_id="light-ctrl",    name="Контроллер освещения",  type="actuator",
               description="Управляет яркостью (0–100%) и режимом (AUTO/MANUAL)"),
        Device(device_id="alarm-relay",   name="Реле сигнализации",     type="actuator",
               description="Взводит/снимает охранную сигнализацию"),
    ])
    db.add(Notification(message="Система S.E. Light запущена", severity="info"))
    db.add(ActionLog(actor="system", action="startup", details="Initial seed completed"))
    db.commit()


_db = SessionLocal()
try:
    seed(_db)
finally:
    _db.close()


# ── FastAPI ──────────────────────────────────────────────────────────────────
app = FastAPI(title="S.E. Light API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(sensors.router)
app.include_router(actuators.router)
app.include_router(notifications.router)
app.include_router(logs.router)


@app.on_event("startup")
def on_startup():
    emulator.start()


@app.on_event("shutdown")
def on_shutdown():
    emulator.stop()


@app.get("/")
def root():
    return {"message": "S.E. Light API v2.0", "time": datetime.now().isoformat()}
