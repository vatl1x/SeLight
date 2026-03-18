export const getStatCards = (
    latest: Record<string, any>,
    analytics: Record<string, any>,
) => [
    {
        icon: "☀️",
        label: "Освещённость",
        value: latest?.["lux-sensor"]?.value?.toFixed(0) ?? "—",
        unit: " Lux",
        color: "var(--yellow)",
        sub: latest?.["lux-sensor"]?.timestamp
            ? new Date(latest["lux-sensor"].timestamp).toLocaleTimeString(
                  "ru-RU",
              )
            : "",
    },
    {
        icon: "🏃",
        label: "Движение",
        value: latest?.["motion-sensor"]?.value === 1 ? "Да" : "Нет",
        unit: "",
        color:
            latest?.["motion-sensor"]?.value === 1
                ? "var(--red)"
                : "var(--green)",
    },
    {
        icon: "🌡️",
        label: "Температура",
        value: latest?.["temp-sensor"]?.value?.toFixed(1) ?? "—",
        unit: " °C",
        color: "var(--accent)",
    },
    {
        icon: "⚡",
        label: "Мощность",
        value: latest?.["power-sensor"]?.value?.toFixed(1) ?? "—",
        unit: " Вт",
        color: "var(--accent2)",
        sub: `${analytics?.energy_summary?.total_kwh ?? 0} кВт⋅ч за период`,
    },
];

export const getChartCards = (analytics: Record<string, any>) => [
    {
        title: "☀️ Освещённость (Lux)",
        stats: [
            `Ср: ${analytics.sensors["lux-sensor"]?.avg}`,
            `Мин: ${analytics.sensors["lux-sensor"]?.min}`,
            `Макс: ${analytics.sensors["lux-sensor"]?.max}`,
        ],
        series: analytics.sensors["lux-sensor"]?.series,
        color: "#fbbf24",
        unit: "Lux",
    },
    {
        title: "⚡ Мощность (Вт)",
        stats: [
            `Ср: ${analytics.sensors["power-sensor"]?.avg} Вт`,
            `Всего: ${analytics.energy_summary?.total_kwh} кВт⋅ч`,
        ],
        series: analytics.sensors["power-sensor"]?.series,
        color: "#a78bfa",
        unit: "Вт",
    },
    {
        title: "🌡️ Температура (°C)",
        stats: [
            `Ср: ${analytics.sensors["temp-sensor"]?.avg}°C`,
            `Мин: ${analytics.sensors["temp-sensor"]?.min}°C`,
            `Макс: ${analytics.sensors["temp-sensor"]?.max}°C`,
        ],
        series: analytics.sensors["temp-sensor"]?.series,
        color: "#6c8aff",
        unit: "°C",
    },
    {
        title: "🏃 Движение (события)",
        stats: [
            `Событий: ${analytics.sensors["motion-sensor"]?.count}`,
            `Детекций: ${Math.round((analytics.sensors["motion-sensor"]?.avg ?? 0) * 100)}%`,
        ],
        series: analytics.sensors["motion-sensor"]?.series,
        color: "#34d399",
        unit: "",
    },
];
