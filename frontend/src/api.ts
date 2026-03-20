import { ActuatorsStatus, AuthUser, Device } from "./interfaces";

const BASE = "http://localhost:8000";

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

function getToken(): string | null {
    return localStorage.getItem("token");
}

async function request<T = unknown>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const token = getToken();
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Request failed");
    }

    return res.json() as Promise<T>;
}

export const api = {
    login: (username: string, password: string) => {
        const body = new URLSearchParams({ username, password });
        return request<{ access_token: string; token_type: string }>(
            "/auth/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            },
        );
    },

    me: () =>
        request<AuthUser>("/auth/me"),

    getDevices: () => request<Device[]>("/devices"),
    patchDevice: (id: string, data: { is_active: boolean }) =>
        request(`/devices/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }),

    getSensorsLatest: () =>
        request<Record<string, { value: number; timestamp: string }>>(
            "/sensors/latest",
        ),
    getSensorsAnalytics: (hours: number = 24) =>
        request<Record<string, unknown>>(`/sensors/analytics?hours=${hours}`),

    getActuatorsStatus: () => request<ActuatorsStatus>("/actuators/status"),
    lightCommand: (brightness: number, mode: string) =>
        request("/actuators/light-ctrl/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ brightness, mode }),
        }),
    alarmCommand: (armed: boolean) =>
        request("/actuators/alarm-relay/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ armed }),
        }),

    getNotifications: (unreadOnly: boolean = false) =>
        request(`/notifications${unreadOnly ? "?unread_only=true" : ""}`),
    getUnreadCount: () =>
        request<{ count: number }>("/notifications/unread-count"),
    markRead: (id: number) =>
        request(`/notifications/${id}/read`, { method: "POST" }),
    readAll: () => request("/notifications/read-all", { method: "POST" }),
    clearNotifications: () =>
        request("/notifications/clear", { method: "DELETE" }),

    getLogs: () => request("/logs"),
};
