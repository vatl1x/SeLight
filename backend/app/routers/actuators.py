"""
Роутер актуаторов.
Принимает команды от пользователя, обновляет состояние в эмуляторе
и сохраняет историю команд в БД.
"""
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ActuatorState, ActionLog, User
from ..services import emulator
from .auth import get_current_user

router = APIRouter(prefix="/actuators", tags=["actuators"])


# ── Схемы команд ─────────────────────────────────────────────────────────────

class LightCommand(BaseModel):
    brightness: int   # 0–100
    mode: str         # "AUTO" | "MANUAL"


class AlarmCommand(BaseModel):
    armed: bool


@router.get("/status")
def actuators_status(_: User = Depends(get_current_user)):
    """Текущее состояние всех актуаторов (из памяти эмулятора)."""
    return emulator.actuator_states


@router.post("/light-ctrl/command")
def light_command(
    cmd: LightCommand,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Установить яркость и режим работы контроллера освещения."""
    if not 0 <= cmd.brightness <= 100:
        raise HTTPException(400, "brightness must be 0–100")
    if cmd.mode not in ("AUTO", "MANUAL"):
        raise HTTPException(400, "mode must be AUTO or MANUAL")

    state = emulator.actuator_states["light-ctrl"]
    state["brightness"] = cmd.brightness
    state["mode"] = cmd.mode
    state["is_on"] = cmd.brightness > 0

    db.add(ActuatorState(device_id="light-ctrl", state_json=json.dumps(state)))
    db.add(ActionLog(
        actor=user.username,
        action="light_command",
        details=f"brightness={cmd.brightness} mode={cmd.mode}",
    ))
    db.commit()
    return {"status": "ok", "state": state}


@router.post("/alarm-relay/command")
def alarm_command(
    cmd: AlarmCommand,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Взвести или снять охранную сигнализацию."""
    state = emulator.actuator_states["alarm-relay"]
    state["armed"] = cmd.armed
    if not cmd.armed:
        state["triggered"] = False   # снять тревогу

    db.add(ActuatorState(device_id="alarm-relay", state_json=json.dumps(state)))
    db.add(ActionLog(
        actor=user.username,
        action="alarm_command",
        details=f"armed={cmd.armed}",
    ))
    db.commit()
    return {"status": "ok", "state": state}
