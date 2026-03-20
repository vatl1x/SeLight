import { useDashboard } from "../../hooks/useDashboard";
import { getStatCards, getChartCards } from "./Dashboard.constants";
import { StatCard } from "./StatCard/StatCard";
import { MiniChart } from "./MiniChart/MiniChart";
import { ActuatorCard } from "./ActuatorCard/ActuatorCard";
import styles from "./Dashboard.module.scss";
import { useRefresh } from "../../hooks/useRefresh";

const Dashboard = () => {
    const { refreshing, refresh } = useRefresh();
    const { latest, analytics, actuators, hours, setHours, load } =
        useDashboard();

    const statCards =
        latest && analytics ? getStatCards(latest, analytics) : [];
    const chartCards = analytics ? getChartCards(analytics) : [];
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Дашборд</h1>
                <div className={styles.controls}>
                    <select
                        className={styles.periodSelect}
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                    >
                        <option value={1}>Последний час</option>
                        <option value={6}>6 часов</option>
                        <option value={24}>24 часа</option>
                        <option value={72}>3 дня</option>
                    </select>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            refresh(load);
                        }}
                    >
                        ↺ Обновить
                    </button>
                </div>
            </div>
            <div className={refreshing ? "refreshing" : ""}>
                <div className={styles.actuatorsRow}>
                    <ActuatorCard
                        type="light"
                        state={actuators?.["light-ctrl"]}
                    />
                    <ActuatorCard
                        type="alarm"
                        state={actuators?.["alarm-relay"]}
                    />
                </div>

                <div className={styles.sensorsRow}>
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                {analytics && (
                    <div className={styles.chartsGrid}>
                        {chartCards.map((card) => (
                            <div key={card.title} className="card">
                                <div className="card-title">{card.title}</div>
                                <div className={styles.chartStats}>
                                    {card.stats.map((stat) => (
                                        <span key={stat}>{stat}</span>
                                    ))}
                                </div>
                                <MiniChart
                                    series={card.series}
                                    color={card.color}
                                    unit={card.unit}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
