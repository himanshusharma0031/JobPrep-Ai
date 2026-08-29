import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getMe, logout } from "../services/auth.api";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            if (data?.user) {
                setUser(data.user);
                return data
            }
        } catch (err) {
            console.log("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);

        try {
            const data = await register({ username, email, password });

            if (data?.user) {
                setUser(data.user)
                return data
            }
        } catch (err) {
            console.log("Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.log("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe();

                if (data?.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log("Get user error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout
    };
};


