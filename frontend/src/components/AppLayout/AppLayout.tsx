import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import LightControl from "../LightControl/LightControl";
import Notifications from "../Notifications/Notifications";
import DeviceList from "../DeviceList/DeviceList";
import Logs from "../Logs/Logs";
import { AuthUser } from "../../interfaces";

import styles from "./AppLayout.module.scss";

interface Props {
    onLogout: () => void;
    user: AuthUser | null;
}

export const AppLayout = ({ onLogout, user }: Props) => (
    <div className={styles.layout}>
        <Sidebar onLogout={onLogout} role={user?.role ?? null}/>
        <main className={styles.main}>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/control" element={<LightControl user={user} />} />
                <Route
                    path="/notifications"
                    element={<Notifications />}
                />
                <Route path="/devices" element={<DeviceList user={user} />} />
                <Route path="/logs" element={<Logs />} />
            </Routes>
        </main>
    </div>
);
