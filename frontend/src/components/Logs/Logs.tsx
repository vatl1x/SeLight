import { useLogs } from "../../hooks/useLogs";
import { LogsTable } from "../../components/LogsTable/LogsTable";
import styles from "./Logs.module.scss";

const Logs = () => {
    const { logs, loading, load } = useLogs();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Журнал действий</h1>
                <button className="btn btn-ghost" onClick={load}>
                    ↺ Обновить
                </button>
            </div>

            {loading && <div className={styles.empty}>Загрузка…</div>}
            {!loading && logs.length === 0 && (
                <div className={styles.empty}>Журнал пуст</div>
            )}
            {!loading && logs.length > 0 && <LogsTable logs={logs} />}
        </div>
    );
};

export default Logs;
