import { useState } from "react";

export const useRefresh = () => {
    const [refreshing, setRefreshing] = useState(false);

    async function refresh(fn: () => Promise<void>) {
        setRefreshing(true);
        await fn();
        setTimeout(() => setRefreshing(false), 400);
    }

    return { refreshing, refresh };
};
