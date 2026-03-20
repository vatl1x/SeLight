export type Severity = "info" | "warning" | "error";

export const SEV_META: Record<Severity, { icon: string; modifier: string }> = {
    info: { icon: "ℹ️", modifier: "info" },
    warning: { icon: "⚠️", modifier: "warn" },
    error: { icon: "❌", modifier: "err" },
};

export type FilterType = "all" | "unread";

export const FILTERS: { id: FilterType; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "unread", label: "Непрочитанные" },
];
