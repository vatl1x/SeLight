import { useLogin } from "../../hooks/useLogin";
import { LoginForm } from "../../components/LoginForm/LoginForm";
import styles from "./Login.module.scss";

interface Props {
    onLogin: (token: string) => void;
}

const Login = ({ onLogin }: Props) => {
    const {
        username,
        setUsername,
        password,
        setPassword,
        error,
        loading,
        handleSubmit,
    } = useLogin(onLogin);

    return (
        <div className={styles.wrap}>
            <div className={styles.card}>
                <div className={styles.logo}>💡</div>
                <h1 className={styles.title}>S.E. Light</h1>
                <p className={styles.subtitle}>Smart Energy Lighting System</p>

                <LoginForm
                    username={username}
                    password={password}
                    error={error}
                    loading={loading}
                    onUsernameChange={setUsername}
                    onPasswordChange={setPassword}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default Login;
