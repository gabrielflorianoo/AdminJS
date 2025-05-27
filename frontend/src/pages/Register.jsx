import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [role, setRole] = React.useState("VOLUNTEER"); // Default role
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await register(name, email, password, role)
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                setError(err.response.data.error);
            });
    };

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 400 }}>
                <h1 className="title">Registrar</h1>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Nome</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">E-mail</label>
                        <div className="control">
                            <input
                                type="email"
                                className="input"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Senha</label>
                        <div className="control">
                            <input
                                type="password"
                                className="input"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Função</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="ADMIN" disabled>
                                        Administrador
                                    </option>
                                    <option value="COORDINATOR">
                                        Coordenador
                                    </option>
                                    <option value="VOLUNTEER">
                                        Voluntário
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="field">
                            <div className="notification is-danger">
                                {error}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="button is-primary is-fullwidth"
                    >
                        Registrar
                    </button>
                </form>
            </div>
        </section>
    );
}
