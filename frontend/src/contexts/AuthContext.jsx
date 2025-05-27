import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../server/Api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Verifica se o usuário já está logado ao carregar o app
    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                setUser(res.data.user);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        await api.post("/auth/login", { email, password });
        const res = await api.get("/auth/me"); // busca dados do usuário após login
        setUser(res.data.user);
        navigate("/"); // ou rota desejada
    };

    const register = async (name, email, password, role) => {
        await api.post("/auth/register", { name, email, password, role });
        const res = await api.get("/auth/me"); // busca dados do usuário após registro
        setUser(res.data.user);
        navigate("/"); // ou rota desejada
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
