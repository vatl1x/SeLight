from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ActionLog, User
from .auth import get_current_user

router = APIRouter(prefix="/logs", tags=["logs"])


@router.get("")
def get_logs(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return (
        db.query(ActionLog)
        .order_by(ActionLog.timestamp.desc())
        .limit(100)
        .all()
    )
