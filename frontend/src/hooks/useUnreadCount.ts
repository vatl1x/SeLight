import { useState, useEffect } from "react";
import { api } from "../api";

export const useUnreadCount = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchCount = () =>
            api
                .getUnreadCount()
                .then((data) => setUnreadCount(data.count))
                .catch(() => {});

        fetchCount();
        const interval = setInterval(fetchCount, 10000);
        return () => clearInterval(interval);
    }, []);

    return { unreadCount };
};
