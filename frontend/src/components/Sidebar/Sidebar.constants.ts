export interface NavItem {
    id: string;
    icon: string;
    label: string;
    adminOnly: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", icon: "📊", label: "Дашборд", adminOnly: false },
    { id: "control", icon: "💡", label: "Управление", adminOnly: false },
    { id: "devices", icon: "🔌", label: "Устройства", adminOnly: false },
    { id: "notifications", icon: "🔔", label: "Уведомления", adminOnly: false },
    { id: "logs", icon: "📋", label: "Журнал", adminOnly: true },
];
