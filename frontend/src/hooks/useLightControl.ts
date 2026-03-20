import { useState, useEffect } from "react";
import { api } from "../api";
import { ActuatorsStatus, AlarmState, LightState } from "../interfaces";

export const useLightControl = () => {
    const [light, setLight] = useState<LightState | null>(null);
    const [alarm, setAlarm] = useState<AlarmState | null>(null);
    const [brightness, setBrightness] = useState(75);
    const [mode, setMode] = useState("AUTO");
    const [armedLocal, setArmedLocal] = useState(false);
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState<"ok" | "err">("ok");

    async function load(): Promise<void> {
        try {
            const actuators =
                (await api.getActuatorsStatus()) as ActuatorsStatus;
            setLight(actuators["light-ctrl"]);
            setAlarm(actuators["alarm-relay"]);
            setBrightness(actuators["light-ctrl"]?.brightness ?? 75);
            setMode(actuators["light-ctrl"]?.mode ?? "AUTO");
            setArmedLocal(actuators["alarm-relay"]?.armed ?? false);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function flash(text: string, type: "ok" | "err" = "ok") {
        setMsg(text);
        setMsgType(type);
        setTimeout(() => setMsg(""), 3000);
    }

    async function applyLight() {
        try {
            await api.lightCommand(brightness, mode);
            flash(`✅ Яркость ${brightness}%, режим ${mode} применены`);
            load();
        } catch (e: any) {
            flash("❌ Ошибка: " + e.message, "err");
        }
    }

    async function applyAlarm(armed: boolean) {
        try {
            await api.alarmCommand(armed);
            setArmedLocal(armed);
            flash(armed ? "🔒 Сигнализация взведена" : "🔓 Сигнализация снята");
            load();
        } catch (e: any) {
            flash("❌ Ошибка: " + e.message, "err");
        }
    }

    return {
        light,
        alarm,
        brightness,
        setBrightness,
        mode,
        setMode,
        armedLocal,
        msg,
        msgType,
        load,
        applyLight,
        applyAlarm,
    };
};
