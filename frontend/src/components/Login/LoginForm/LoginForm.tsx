import styles from "./LoginForm.module.scss";

interface Props {
    username: string;
    password: string;
    error: string;
    loading: boolean;
    onUsernameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({
    username,
    password,
    error,
    loading,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
}: Props) => (
    <form onSubmit={onSubmit} className={styles.form}>
        <label className={styles.label}>
            Логин
            <input
                type="text"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="admin"
                autoFocus
                required
                className={styles.input}
            />
        </label>

        <label className={styles.label}>
            Пароль
            <input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••••"
                required
                className={styles.input}
            />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <button
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
        >
            {loading ? "Вход…" : "Войти"}
        </button>
    </form>
);
