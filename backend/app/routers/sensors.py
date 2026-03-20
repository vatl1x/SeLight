from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import SensorReading, User
from .auth import get_current_user

router = APIRouter(prefix="/sensors", tags=["sensors"])

SENSOR_IDS = ["lux-sensor", "motion-sensor", "temp-sensor", "power-sensor"]


@router.get("/latest")
def sensors_latest(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Последнее показание каждого датчика."""
    result = {}
    for sid in SENSOR_IDS:
        row = (
            db.query(SensorReading)
            .filter(SensorReading.device_id == sid)
            .order_by(SensorReading.timestamp.desc())
            .first()
        )
        result[sid] = {
            "value": float(row.value) if row else 0,
            "timestamp": row.timestamp.isoformat() if row else None,
        }
    return result


@router.get("/analytics")
def sensors_analytics(
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Аналитика + временной ряд за последние N часов."""
    since = datetime.now() - timedelta(hours=hours)
    analytics = {}

    for sid in SENSOR_IDS:
        rows = (
            db.query(SensorReading)
            .filter(
                SensorReading.device_id == sid,
                SensorReading.timestamp >= since,
            )
            .order_by(SensorReading.timestamp.asc())
            .all()
        )
        values = [float(r.value) for r in rows]
        analytics[sid] = {
            "avg": round(sum(values) / len(values), 2) if values else 0,
            "min": round(min(values), 2) if values else 0,
            "max": round(max(values), 2) if values else 0,
            "count": len(values),
            "series": [
                {"time": r.timestamp.strftime("%H:%M"), "value": float(r.value)}
                for r in rows[-50:]
            ],
        }

    power_vals = [
        float(r.value) for r in
        db.query(SensorReading)
        .filter(
            SensorReading.device_id == "power-sensor",
            SensorReading.timestamp >= since,
        )
        .all()
    ]
    interval_h = 5 / 3600
    total_kwh = sum(power_vals) * interval_h / 1000

    return {
        "period_hours": hours,
        "sensors": analytics,
        "energy_summary": {
            "total_kwh": round(total_kwh, 4),
            "avg_power_w": round(sum(power_vals) / len(power_vals), 1) if power_vals else 0,
        },
    }