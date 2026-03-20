import { useLogs } from "../../hooks/useLogs";
import { LogsTable } from "./LogsTable/LogsTable";
import styles from "./Logs.module.scss";
import { useRefresh } from "../../hooks/useRefresh";

const Logs = () => {
    const { refreshing, refresh } = useRefresh();
    const { logs, loading, load } = useLogs();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Журнал действий</h1>
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        refresh(load);
                    }}
                >
                    ↺ Обновить
                </button>
            </div>
            <div className={refreshing ? "refreshing" : ""}>
                {loading && <div className={styles.empty}>Загрузка…</div>}
                {!loading && logs.length === 0 && (
                    <div className={styles.empty}>Журнал пуст</div>
                )}
                {!loading && logs.length > 0 && <LogsTable logs={logs} />}
            </div>
        </div>
    );
};

export default Logs;
