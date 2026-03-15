from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Device, ActionLog, User
from .auth import get_current_user

router = APIRouter(prefix="/devices", tags=["devices"])


class DevicePatch(BaseModel):
    is_active: bool


@router.get("")
def get_devices(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(Device).all()


@router.patch("/{device_id}")
def patch_device(
    device_id: str,
    body: DevicePatch,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    dev = db.query(Device).filter(Device.device_id == device_id).first()
    if not dev:
        raise HTTPException(404, "Device not found")
    dev.is_active = body.is_active
    db.add(ActionLog(
        actor=user.username,
        action="device_patch",
        details=f"{device_id} is_active={body.is_active}",
    ))
    db.commit()
    return dev
