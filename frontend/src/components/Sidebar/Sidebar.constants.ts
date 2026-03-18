export interface NavItem {
    id: string;
    icon: string;
    label: string;
}

export const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", icon: "📊", label: "Дашборд" },
    { id: "control", icon: "💡", label: "Управление" },
    { id: "devices", icon: "🔌", label: "Устройства" },
    { id: "notifications", icon: "🔔", label: "Уведомления" },
    { id: "logs", icon: "📋", label: "Журнал" },
];
