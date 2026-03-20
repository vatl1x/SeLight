export interface Device {
    id: number;
    device_id: string;
    name: string;
    description: string;
    type: "sensor" | "actuator";
    unit?: string;
    value_min: number;
    value_max: number;
    is_active: boolean;
}

export interface AuthUser {
    username: string;
    email: string;
    role: "admin" | "operator";
}

export interface LightState {
    is_on: boolean;
    mode: string;
    brightness: number;
}

export interface AlarmState {
    armed: boolean;
    triggered: boolean;
    trigger_count: number;
}

export interface ActuatorsStatus {
  "light-ctrl": LightState
  "alarm-relay": AlarmState
}

export interface LogEntry {
    id: number;
    actor: string;
    action: string;
    details: string;
    timestamp: string;
}
