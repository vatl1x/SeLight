import { LogEntry } from "../../../interfaces";
import { ACTION_ICONS, TABLE_COLUMNS } from "../Logs.constants";
import styles from "./LogsTable.module.scss";

interface Props {
    logs: LogEntry[];
}

export const LogsTable = ({ logs }: Props) => (
    <div className={`card ${styles.tableWrap}`}>
        <table className={styles.table}>
            <thead>
                <tr>
                    {TABLE_COLUMNS.map((column) => (
                        <th key={column} className={styles.th}>
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {logs.map((entry) => (
                    <tr key={entry.id}>
                        <td className={styles.cellId}>{entry.id}</td>
                        <td className={styles.cellTime}>
                            {new Date(entry.timestamp).toLocaleString("ru-RU")}
                        </td>
                        <td>
                            <span
                                className={`badge ${entry.actor === "system" ? "badge-blue" : "badge-green"}`}
                            >
                                {entry.actor}
                            </span>
                        </td>
                        <td>
                            <span className={styles.cellAction}>
                                {ACTION_ICONS[entry.action] ?? "📌"}{" "}
                                {entry.action}
                            </span>
                        </td>
                        <td className={styles.cellDetails}>
                            {entry.details || "—"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
