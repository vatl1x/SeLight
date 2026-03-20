from sqlalchemy import Column, Integer, Float, Boolean, String, DateTime
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String)
    password = Column(String)          # plain-text for demo
    is_active = Column(Boolean, default=True)
    role = Column(String, default="operator")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String)              # "sensor" | "actuator"
    description = Column(String)
    unit = Column(String, nullable=True)
    value_min = Column(Float, nullable=True)
    value_max = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)


class SensorReading(Base):
    """Хранит поступающие показания датчиков."""
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    value = Column(Float)
    timestamp = Column(DateTime, default=datetime.now, index=True)


class ActuatorState(Base):
    """Журнал изменений состояния актуаторов."""
    __tablename__ = "actuator_states"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    state_json = Column(String)        # JSON-строка
    timestamp = Column(DateTime, default=datetime.now)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    severity = Column(String)          # "info" | "warning" | "error"
    device_id = Column(String, nullable=True)
    read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.now)


class ActionLog(Base):
    """Лог действий пользователей и системы."""
    __tablename__ = "action_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String)             # username или "system"
    action = Column(String)
    details = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
