from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Notification, ActionLog, User
from .auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def get_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    q = db.query(Notification).order_by(Notification.timestamp.desc())
    if unread_only:
        q = q.filter(Notification.read == False)
    return q.limit(100).all()


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    n = db.query(Notification).filter(Notification.read == False).count()
    return {"count": n}


@router.post("/{notif_id}/read")
def mark_read(
    notif_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    n = db.query(Notification).filter(Notification.id == notif_id).first()
    if not n:
        raise HTTPException(404, "Not found")
    n.read = True
    db.commit()
    return {"status": "ok"}


@router.post("/read-all")
def read_all(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    db.query(Notification).filter(Notification.read == False).update({"read": True})
    db.add(ActionLog(actor=user.username, action="read_all_notifications", details=""))
    db.commit()
    return {"status": "ok"}



@router.delete("/clear")
def clear_notifications(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    db.query(Notification).delete()
    db.add(ActionLog(actor=user.username, action="clear_notifications", details=""))
    db.commit()
    return {"status": "ok"}